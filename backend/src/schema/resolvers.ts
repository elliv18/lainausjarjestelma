import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";
import { mustBeLoggedIn, mustBeAtleastLevel, UserLevels } from "../misc/auth";
import { prisma } from "../generated/prisma-client";
import {
  JWT_SECRET,
  JWT_TIME,
  SALT_ROUNDS,
  MAX_PW,
  MIN_PW,
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
    allUsers: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      logger.log(
        "info",
        "[Q ALLUSERS] User %s - list all users",
        currentUser.id
      );
      return await prisma.users();
    },
    allCategories: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      logger.log(
        "info",
        "[Q ALLCATEGORIES] User %s - list all categories",
        currentUser.id
      );
      return await prisma.categories();
    },
    allDevices: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      logger.log(
        "info",
        "[Q ALLDEVICES] User %s - list all devices",
        currentUser.id
      );
      return await prisma.devices();
    },
    allLoans: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.STAFF);

      logger.log(
        "info",
        "[Q ALLLOANS] User %s - list all loans",
        currentUser.id
      );
      return await prisma.loans();
    },
    isBackendRdy: async (obj, args, ctx) => {
      if (await prisma.$exists.user({ email: ROOT_ADMIN_EMAIL })) {
        logger.log("info", "[Q ISBACKENDRDY] Backend is rdy");
        return { rdy: true };
      } else {
        logger.log("info", "[Q ISBACKENDRDY] Backend is not rdy");
        return { rdy: false };
      }
    }
  },
  /************ MUTATIONS **************************/
  Mutation: {
    currentUser: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);

      logger.log(
        "info",
        "[M CURRENTUSER] Current user %s information ask",
        currentUser.id
      );
      return await prisma.user({ id: currentUser.id });
    },
    // CURRENTUSER UPDATE
    currentUserUpdateInfo: async (
      obj,
      { input: { firstName, lastName, address, phone } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);

      const user = await prisma.updateUser({
        data: _.pickBy(
          {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone
          },
          _.identity
        ),
        where: {
          id: currentUser.id
        }
      });

      logger.log(
        "info",
        "[M CURRENTUSER UPDATE] User %s information is updated!",
        currentUser.id
      );
      return { user };
    },
    // CURRENTUSER PASSWORD UPDATE
    currentUserUpdatePW: async (
      obj,
      { input: { password, passwordAgain, oldPassword } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);

      // if pass is null...
      if (oldPassword === null || passwordAgain === null || password === null) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Old password or password or password again is null from user %s",
          currentUser.id
        );
        throw new Error("Password can not be null!");
      }

      // is oldpassword same as db one?
      const cU = await prisma.user({ id: currentUser.id });
      if (!(await bcrypt.compare(oldPassword, cU.password))) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Old password is invalid from user %s",
          currentUser.id
        );
        throw new Error("Old password not match!");
      }

      // is new password write right?
      if (password !== passwordAgain) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password and password again not match from user %s",
          currentUser.id
        );
        throw new Error("Password and password again not match!");
      }

      // password is only whitespaces
      if (!password.replace(/\s/g, "").length) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is spaces only from user %s",
          currentUser.id
        );
        throw new Error("Password can not be empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is too long from user %s",
          currentUser.id
        );
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is too short from user %s",
          currentUser.id
        );
        throw new Error("Password too short!");
      }

      const user = await prisma.updateUser({
        data: {
          password: await bcrypt.hash(password, SALT_ROUNDS)
        },
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
        logger.log("warn", "[M LOGIN] Email %s not found", email);
        throw new Error("Email not found!");
      }

      if (!user.isActive) {
        logger.log("warn", "[M LOGIN] User %s is not active!", email);
        throw new Error("Account is disabled, contact administrator!");
      }

      const pwValid = await bcrypt.compare(password, user.password);

      if (!pwValid) {
        logger.log("warn", "[M LOGIN] Password is invalid from user %s", email);
        throw new Error("Password is invalid!");
      }

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET, {
        expiresIn: JWT_TIME
      });

      logger.log(
        "info",
        "[M LOGIN] Login succesful! Logged user is: %s",
        email
      );
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
          "[M USERCREATE] No permissions by %s or user type %s is invalid!",
          currentUser.id,
          userType
        );
        throw new Error("No permissions or user type is invalid!");
      }

      // password legality checks
      if (!password.replace(/\s/g, "").length || password === null) {
        logger.log(
          "warn",
          "[M USERCREATE] Password is null from user %s",
          currentUser.id
        );
        throw new Error("Password can not be null or empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log(
          "warn",
          "[M USERCREATE] Password is too long from user %s",
          currentUser.id
        );
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log(
          "warn",
          "[M USERCREATE] Password is too short from user %s",
          currentUser.id
        );
        throw new Error("Password too short!");
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
        "[M USERCREATE] New %s user %s created by %s",
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
            "[M USERUPDATE] No permissions by %s or user type %s is invalid!",
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
        "[M USERUPDATE] User %s have updated by %s",
        email,
        currentUser.id
      );
      return { user };
    },
    // USER PASSWORD UPDATE
    userUpdatePW: async (
      obj,
      { input: { id, password, passwordAgain } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      // password legality checks
      if (
        !password.replace(/\s/g, "").length ||
        password === null ||
        !passwordAgain.replace(/\s/g, "").length ||
        passwordAgain === null
      ) {
        logger.log(
          "warn",
          "[M USERUPDATEPW] Password is null updated by %s",
          currentUser.id
        );
        throw new Error("Password can not be null or empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log(
          "warn",
          "[M USERUPDATEPW] Password is too long updated by %s",
          currentUser.id
        );
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log(
          "warn",
          "[M USERUPDATEPW] Password is too short updated by %s",
          currentUser.id
        );
        throw new Error("Password too short!");
      }
      if (password !== passwordAgain) {
        logger.log(
          "warn",
          "[M USERUPDATEPW] Password don't match updated by %s",
          currentUser.id
        );
        throw new Error("Password don't match!");
      }

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
        "[M USERUPDATEPW] User %s password have been updated by %s",
        id,
        currentUser.id
      );
      return { user };
    },
    // SET USER ACTIVE/INACTIVE
    userIsActive: async (obj, { input: { id, isActive } }, { currentUser }) => {
      mustBeLoggedIn(currentUser);
      mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

      if (!isActive) {
        const loans = await prisma.user({ id: id }).loans();
        console.log(loans);
        loans.map(obj => {
          if (obj.isActive) {
            logger.log(
              "warn",
              "[M USERISACTIVE] User %s have active loans. Cant disable user!",
              currentUser.id
            );
            throw new Error("User have active loans!");
          }
        });

        const u = await prisma.user({ id: id });
        if (u.email === ROOT_ADMIN_EMAIL) {
          logger.log(
            "warn",
            "[M USERISACTIVE] Can't disable root admin!",
            currentUser.id
          );
          throw new Error("Can't disable root admin!");
        }
      }

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
        "[M USERISACTIVE] User %s active status is %s, set by %s",
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
        "[M CATEGORYCREATE] New category %s have been created by %s",
        deviceCategory,
        currentUser.id
      );
      return { category };
    },
    // CATEGORY UPDATE
    categoryUpdate: async (
      obj,
      { input: { id, deviceCategory, desription } },
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
          id: id
        }
      });

      logger.log(
        "info",
        "[M CATEGORYUPDATE] Category %s have been updated by %s",
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
        "[M DEVICECATEGORYDELETE] Device category %s have deleted by %s",
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

      console.log(
        "---------------------------------- CREATE DEVICE **********************************",
        device
      );

      logger.log(
        "info",
        "[M DEVICECREATE] New device %s have been created by %s",
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

      const dev = await prisma.device({ idCode: idCode });
      if (dev.loanStatus) {
        logger.log(
          "warn",
          "[M DEVICEUPDATE] Device is loaned, can't edit info!",
          currentUser.id
        );
        throw new Error("Device is loaned, can't edit info!");
      }

      const catId = await prisma.category({ deviceCategory: deviceCategory });

      const device = await prisma.updateDevice({
        data: _.pickBy(
          {
            manufacture: manufacture,
            model: model,
            info: info,
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
        "[M DEVICEUPDATE] Device %s have updated by %s",
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
        "[M DEVICEDELETE] Device %s have deleted by %s",
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
          "[M LOANCREATE] Device %s is already loaned, cant create loan",
          devIdCode
        );
        throw new Error("Device is already loaned!");
      }

      const user = await prisma.user({ email: loaner });

      if (!user.isActive) {
        logger.log(
          "info",
          "[M LOANCREATE] User %s is not active user, can't create loan",
          loaner
        );
        throw new Error("Loaner is not active user!");
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
        "[M LOANCREATE] New loan to device %s have been created by %s",
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
        "[M LOANRETURN] Loan %s returned by %s",
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
            "[M LOANDELETE] Staff %s, deleting time is timeout!",
            currentUser.id
          );
          throw new Error("Permission denied!");
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
        "[M LOANDELETE] Loan %s have deleted by %s",
        id,
        currentUser.id
      );
      return { loan };
    }
  }
};
