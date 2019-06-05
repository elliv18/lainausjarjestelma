import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";
import { mustBeLoggedIn, mustBeAtleastLevel, UserLevels } from "../misc/auth";
import { prisma } from "../generated/prisma-client";
import {
  JWT_SECRET,
  JWT_TIME,
  SALT_ROUNDS,
  ROOT_ADMIN_EMAIL
} from "../environment";
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
      return await prisma.device({ id: device.id }).categoryId();
    },
    async loan(loan) {
      return await prisma.device({ id: loan.id }).loan();
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

      return await prisma.categories();
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
    // CURRENTUSER UPDATE
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
    // LOGIN
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

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET, {
        expiresIn: JWT_TIME
      });

      logger.log("info", "[LOGIN] Login succesful! Logged user is: %s", email);
      return { jwt };
    },
    // USER CREATE
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
    // USER UPDATE
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
    // USER PASSWORD UPDATE
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
    // SET USER ACTIVE/INACTIVE
    userIsActive: async (obj, { input: { id, isActive } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const user = await prisma.updateUser({
        data: {
          isActive: isActive
        },
        where: {
          id: id
        }
      });

      logger.log(
        "info",
        "[USER IS ACTIVE?] User %s active status is %s, set by %s",
        id,
        isActive,
        currentUser.id
      );
      return { user };
    },
    // CATEGORY CREATE
    categoryCreate: async (
      obj,
      { input: { deviceCategory, desription } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.createCategory({
        deviceCategory: deviceCategory,
        desription: desription
      });

      logger.log(
        "info",
        "[CATEGORY CREATE] New category %s have been created by %s",
        deviceCategory,
        currentUser.id
      );
      return { category };
    },
    // CATEGORY UPDATE
    categoryUpdate: async (
      obj,
      { input: { deviceCategory, desription } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.updateCategory({
        data: _.pickBy(
          {
            deviceCategory: deviceCategory,
            desription: desription
          },
          _.identity
        ),
        where: {
          deviceCategory: deviceCategory
        }
      });

      logger.log(
        "info",
        "[CATEGORY UPDATE] Category %s have been updated by %s",
        deviceCategory,
        currentUser.id
      );
      return { category };
    },
    // CATEGORY DELETE
    categoryDelete: async (obj, { input: { id } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const category = await prisma.deleteCategory({
        id: id
      });

      logger.log(
        "info",
        "[DEVICE CATEGORY DELETE] Device category %s have deleted by %s",
        category.deviceCategory,
        currentUser.id
      );
      return category;
    },
    // DEVICE CREATE
    deviceCreate: async (
      obj,
      { input: { idCode, manufacture, model, info, deviceCategory } },
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
        categoryId: {
          connect: { deviceCategory: deviceCategory }
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
    // DEVICE UPDATE
    deviceUpdate: async (
      obj,
      { input: { idCode, manufacture, model, info, deviceCategory } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const catId = await prisma.category({ deviceCategory: deviceCategory });

      const device = await prisma.updateDevice({
        data: _.pickBy(
          {
            idCode: idCode,
            manufacture: manufacture,
            model: model,
            info: info,
            loanStatus: null,
            categoryId: {
              connect: { id: catId.id }
            }
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
    // DEVICE DELETE
    deviceDelete: async (obj, { input: { id } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      const device = await prisma.deleteDevice({ id });

      logger.log(
        "info",
        "[DEVICE] Device %s have deleted by %s",
        device.idCode,
        currentUser.id
      );
      return device;
    },
    // LOAN CREATE
    loanCreate: async (
      obj,
      { input: { loandate, dueDate, devIdCode, loaner } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const dev = await prisma.device({ idCode: devIdCode });
      if (dev.loanStatus) {
        logger.log(
          "info",
          "[LOAN CREATE] Device %s is already loaned, cant create loan",
          devIdCode
        );
        throw new Error("Device is already loaned!");
      }

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

      await prisma.updateDevice({
        data: {
          loanStatus: true
        },
        where: {
          idCode: devIdCode
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
    // LOAN RETURN
    loanReturn: async (obj, { input: { id, returnDate } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      const dev = await prisma.loan({ id: id }).deviceId();

      const loan = await prisma.updateLoan({
        data: {
          isActive: false,
          returnDate: returnDate,
          returnerId: {
            connect: { id: currentUser.id }
          }
        },
        where: {
          id: id
        }
      });

      await prisma.updateDevice({
        data: {
          loanStatus: false
        },
        where: {
          id: dev.id
        }
      });

      logger.log(
        "info",
        "[LOAN RETURN] Loan %s returned by %s",
        id,
        currentUser.id
      );
      return { loan };
    },
    // LOAN DELETE
    loanDelete: async (obj, { input: { id } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      if (currentUser.type === "STAFF") {
        const loan = await prisma.loan({ id: id });

        if (Date.parse(loan.createdAt) >= Date.now() - 30 * 60 * 1000) {
          logger.log(
            "info",
            "[LOAN DELETE] Staff %s, deleting time is timeout!",
            currentUser.id
          );
          throw new Error("Permission denined!");
        }
      } else {
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);
      }

      const device = await prisma.loan({ id: id }).deviceId();

      const loan = await prisma.deleteLoan({ id: id });

      await prisma.updateDevice({
        data: {
          loanStatus: false
        },
        where: {
          id: device.id
        }
      });

      logger.log(
        "info",
        "[LOAN DELETE] Loan %s have deleted by %s",
        id,
        currentUser.id
      );
      return { loan };
    }
  }
};
