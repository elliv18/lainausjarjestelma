import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";
import { mustBeLoggedIn, mustBeAtleastLevel, UserLevels } from "../misc/auth";
import { prisma } from "../generated/prisma-client";
import { JWT_SECRET, SALT_ROUNDS } from "../environment";
import logger from "../misc/logger";

export default {
  /************* RELATIONS *****************/
  User: {
    async loans(user) {
      return await prisma.user({ id: user.id }).loans();
    }
  },
  Device: {
    async category(device) {
      return await prisma.device({ id: device.id }).devCategoryId();
    }
  },
  Loan: {
    async device(device) {
      return await prisma.loan({ id: device.id }).deviceId();
    },
    async loaner(user) {
      return await prisma.loan({ id: user.id }).loanerId();
    },
    async supplier(user) {
      return await prisma.loan({ id: user.id }).supplierId();
    },
    async returner(user) {
      return await prisma.loan({ id: user.id }).returnerId();
    }
  },
  /*************** QUERY **********************/
  Query: {
    currentUser: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);

      return await prisma.user({ id: currentUser.id });
    },
    allUsers: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      return await prisma.users();
    },
    allCategories: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      return await prisma.devCategories();
    },
    allDevices: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      return await prisma.devices();
    },
    allLoans: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      return await prisma.loans();
    },
    oneUser: async (obj, { input: { email } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      return await prisma.user({ email: email });
    }
  },
  /************ MUTATIONS **************************/
  Mutation: {
    currentUserUpdate: async (
      obj,
      { input: { firstName, lastName, address, phone, password, oldPassword } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);

      if (oldPassword != null && password != null) {
        if (!(await bcrypt.compare(oldPassword, currentUser.password))) {
          logger.log(
            "warn",
            "[CURRENTUSER UPDATE] Old password is invalid from user %s",
            currentUser.id
          );
          throw new Error("Password is invalid!");
        }
      }

      if (oldPassword == null) {
        password = null;
      }

      const user = await prisma.updateUser({
        data: _.pickBy(
          {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
            password: password
              ? await bcrypt.hash(password, SALT_ROUNDS)
              : currentUser.password
          },
          _.identity
        ),
        where: {
          id: currentUser.id
        }
      });

      return { user };
    },
    login: async (obj, { input: { email, password } }) => {
      const user = await prisma.user({ email: email });

      if (!user) {
        logger.log("warn", "[LOGIN] Email %s not found", email);
        throw new Error("Email not found!");
      }

      const pwValid = await bcrypt.compare(password, user.password);

      if (!pwValid) {
        logger.log("warn", "[LOGIN] Password is invalid from user %s", email);
        throw new Error("Password is invalid!");
      }

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET);

      logger.log("info", "[LOGIN] Login succesful! Logged user is: %s", email);
      return { jwt };
    },
    userCreate: async (
      obj,
      {
        input: {
          isActive,
          userType,
          email,
          password,
          firstName,
          lastName,
          address,
          personNumber,
          phone
        }
      },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      let type;
      if (currentUser.type === "ADMIN" && userType === "ADMIN") {
        type = UserLevels[UserLevels.ADMIN];
      } else if (currentUser.type === "ADMIN" && userType === "STAFF") {
        type = UserLevels[UserLevels.STAFF];
      } else if (currentUser.type === "ADMIN" && userType === "STUDENT") {
        type = UserLevels[UserLevels.STUDENT];
      } else if (currentUser.type === "STAFF") {
        type = UserLevels[UserLevels.STUDENT];
      } else {
        logger.log(
          "info",
          "[USER CREATE] No permissions by %s or user type %s is invalid!",
          currentUser.id,
          userType
        );
        throw new Error("No permissions or user type is invalid!");
      }

      const user = await prisma.createUser({
        isActive: isActive,
        userType: type,
        email: email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        firstName: firstName,
        lastName: lastName,
        address: address,
        personNumber: personNumber,
        phone: phone
      });

      logger.log(
        "info",
        "[USER CREATE] New %s user %s created by %s",
        type,
        email,
        currentUser.id
      );
      return { user };
    },
    userUpdate: async (
      obj,
      {
        input: {
          id,
          isActive,
          userType,
          email,
          firstName,
          lastName,
          address,
          personNumber,
          phone
        }
      },
      { currentUser }
    ) => {
      console.log("We");
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      let type;
      if (userType != null) {
        if (currentUser.type === "ADMIN" && userType === "ADMIN") {
          type = UserLevels[UserLevels.ADMIN];
        } else if (currentUser.type === "ADMIN" && userType === "STAFF") {
          type = UserLevels[UserLevels.STAFF];
        } else if (currentUser.type === "ADMIN" && userType === "STUDENT") {
          type = UserLevels[UserLevels.STUDENT];
        } else {
          logger.log(
            "info",
            "[USER CREATE] No permissions by %s or user type %s is invalid!",
            currentUser.id,
            userType
          );
          throw new Error("No permissions or user type is invalid!");
        }
      }

      const user = await prisma.updateUser({
        data: _.pickBy(
          {
            isActive: isActive,
            userType: type,
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            personNumber: personNumber,
            phone: phone
          },
          _.identity
        ),
        where: {
          id: id
        }
      });

      logger.log(
        "info",
        "[USER UPDATE] User %s have updated by %s",
        email,
        currentUser.id
      );
      return { user };
    },
    userUpdatePW: async (obj, { input: { id, password } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const user = await prisma.updateUser({
        data: {
          password: await bcrypt.hash(password, SALT_ROUNDS)
        },
        where: {
          id: id
        }
      });

      logger.log(
        "info",
        "[USER UPDATE PW] User %s password have been updated by %s",
        id,
        currentUser.id
      );
      return { user };
    },
    userDelete: async (obj, { input: { email } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const user = await prisma.deleteUser({ email: email });

      logger.log(
        "info",
        "[USER DELETE] User %s have deleted by %s",
        email,
        currentUser.id
      );
      return user;
    },
    categoryCreate: async (
      obj,
      { input: { deviceType, desription } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.createDevCategory({
        deviceType: deviceType,
        desription: desription
      });

      logger.log(
        "info",
        "[CATEGORY CREATE] New category %s have been created by %s",
        deviceType,
        currentUser.id
      );
      return { category };
    },
    categoryUpdate: async (
      obj,
      { input: { deviceType, desription } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.updateDevCategory({
        data: _.pickBy(
          {
            deviceType: deviceType,
            desription: desription
          },
          _.identity
        ),
        where: {
          deviceType: deviceType
        }
      });

      logger.log(
        "info",
        "[CATEGORY UPDATE] Category %s have been updated by %s",
        deviceType,
        currentUser.id
      );
      return { category };
    },
    categoryDelete: async (obj, { input: { deviceType } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.deleteDevCategory({
        deviceType: deviceType
      });

      logger.log(
        "info",
        "[DEVICE CATEGORY DELETE] Device category %s have deleted by %s",
        deviceType,
        currentUser.id
      );
      return category;
    },
    deviceCreate: async (
      obj,
      { input: { idCode, manufacture, model, info, devType } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const device = await prisma.createDevice({
        idCode: idCode,
        manufacture: manufacture,
        model: model,
        info: info,
        loanStatus: false,
        devCategoryId: {
          connect: { deviceType: devType }
        }
      });

      logger.log(
        "info",
        "[DEVICE CREATE] New device %s have been created by %s",
        idCode,
        currentUser.id
      );
      return { device };
    },
    deviceUpdate: async (
      obj,
      { input: { idCode, manufacture, model, info, loanStatus, devCategory } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const device = await prisma.updateDevice({
        data: _.pickBy(
          {
            idCode: idCode,
            manufacture: manufacture,
            model: model,
            info: info,
            loanStatus: loanStatus,
            devCategoryId: devCategory
          },
          _.identity
        ),
        where: {
          idCode: idCode
        }
      });

      logger.log(
        "info",
        "[DEVICE UPDATE] Device %s have updated by %s",
        idCode,
        currentUser.id
      );
      return device;
    },
    deviceDelete: async (obj, { input: { idCode } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const device = await prisma.deleteDevice({ idCode });

      logger.log(
        "info",
        "[DEVICE] Device %s have deleted by %s",
        idCode,
        currentUser.id
      );
      return device;
    },
    loanCreate: async (
      obj,
      { input: { loandate, dueDate, devIdCode, loaner } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const loan = await prisma.createLoan({
        isActive: true,
        loanDate: loandate,
        dueDate: dueDate,
        deviceId: {
          connect: { idCode: devIdCode }
        },
        loanerId: {
          connect: { email: loaner }
        },
        supplierId: {
          connect: { id: currentUser.id }
        }
      });

      logger.log(
        "info",
        "[LOAN CREATE] New loan to device %s have been created by %s",
        devIdCode,
        currentUser.id
      );
      return { loan };
    },
    loanReturn: async (
      obj,
      { input: { idCode, returnDate, returnerId } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const loanData = await prisma.device({ idCode }).loan();

      const loan = await prisma.updateLoan({
        data: {
          isActive: false,
          returnDate: returnDate,
          returnerId: returnerId
        },
        where: {
          id: loanData.id
        }
      });

      logger.log(
        "info",
        "[LOAN RETURN] Loan %s returned by %s",
        loanData.id,
        currentUser.id
      );
      return { loan };
    },
    loanUpdate: async (
      obj,
      {
        input: {
          idCode,
          isActive,
          loanDate,
          returnDate,
          dueDate,
          deviceId,
          loanerId,
          supplierId,
          returnerId
        }
      },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      // get loan id
      const loanData = await prisma.device({ idCode }).loan();

      const loan = await prisma.updateLoan({
        data: _.pickBy(
          {
            isActive: isActive,
            loanDate: loanDate,
            returnDate: returnDate,
            dueDate: dueDate,
            deviceId: deviceId,
            loanerId: loanerId,
            supplierId: supplierId,
            returnerId: returnerId
          },
          _.identity
        ),
        where: {
          id: loanData.id
        }
      });

      logger.log(
        "info",
        "[LOAN UPDATE] Loan %s have updated by %s",
        loanData.id,
        currentUser.id
      );
      return { loan };
    },
    loanDelete: async (obj, { input: { idCode } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      // get loan id
      const loanData = await prisma.device({ idCode }).loan();

      const loan = await prisma.deleteLoan({ id: loanData.id });

      logger.log(
        "info",
        "[LOAN DELETE] Loan %s have deleted by %s",
        loanData.id,
        currentUser.id
      );
      return { loan };
    }
  }
};
