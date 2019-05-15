import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";

import { prisma } from "../generated/prisma-client";
import { JWT_SECRET, SALT_ROUNDS } from "../environment";
import { userInfo } from "os";

export default {
  User: {
    async loans(user) {
      return await prisma.user({ id: user.id }).loans();
    }
  },
  Device: {
    async devCategory(device) {
      return await prisma.device({ id: device.id }).devCategoryId();
    }
  },
  Loan: {
    async deviceId(device) {
      return await prisma.loan({ id: device.id }).deviceId();
    },
    async loanerId(user) {
      return await prisma.loan({ id: user.id }).loanerId();
    },
    async supplierId(user) {
      return await prisma.loan({ id: user.id }).supplierId();
    },
    async returnerId(user) {
      return await prisma.loan({ id: user.id }).returnerId();
    }
  },
  Query: {
    currentUser: async (obj, args, { currentUser }) => {
      return await prisma.user({ id: currentUser.id });
    },
    allUsers: async (obj, args, reg) => {
      return await prisma.users();
    },
    allCategories: async (obj, args, reg) => {
      return await prisma.devCategories();
    },
    allDevices: async (obj, args, reg) => {
      return await prisma.devices();
    },
    allLoans: async (obj, args, reg) => {
      return await prisma.loans();
    },
    oneUser: async (obj, { input: { email } }) => {
      return await prisma.user({ email: email });
    }
  },
  Mutation: {
    login: async (obj, { input: { email, password } }) => {
      const user = await prisma.user({ email: email });
      console.log(user);
      if (!user) {
        throw new Error("Email not found!");
      }

      const pwValid = await bcrypt.compare(password, user.password);

      if (!pwValid) {
        throw new Error("Password is invalid!");
      }

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET);

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
      }
    ) => {
      const user = await prisma.createUser({
        isActive: isActive,
        userType: userType,
        email: email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        firstName: firstName,
        lastName: lastName,
        address: address,
        personNumber: personNumber,
        phone: phone
      });

      return { user };
    },
    userUpdate: async (
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
      }
    ) => {
      let pw;
      if (password != null) {
        pw = await bcrypt.hash(password, SALT_ROUNDS);
      }

      const user = await prisma.updateUser({
        data: _.pickBy(
          {
            isActive: isActive,
            userType: userType,
            email: email,
            password: pw,
            firstName: firstName,
            lastName: lastName,
            address: address,
            personNumber: personNumber,
            phone: phone
          },
          _.identity
        ),
        where: {
          email: email
        }
      });

      return { user };
    },
    userCreateStudent: async (
      obj,
      {
        input: {
          email,
          password,
          firstName,
          lastName,
          address,
          personNumber,
          phone
        }
      }
    ) => {
      const user = await prisma.createUser({
        isActive: true,
        userType: "STUDENT",
        email: email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        firstName: firstName,
        lastName: lastName,
        address: address,
        personNumber: personNumber,
        phone: phone
      });

      return { user };
    },
    categoryCreate: async (obj, { input: { deviceType, desription } }) => {
      const devCategory = await prisma.createDevCategory({
        deviceType: deviceType,
        desription: desription
      });
      return { devCategory };
    },
    categoryUpdate: async (obj, { input: { deviceType, desription } }) => {
      const devCategory = await prisma.updateDevCategory({
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
      return { devCategory };
    },
    deviceCreate: async (
      obj,
      { input: { idCode, manufacture, model, info, devType } }
    ) => {
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

      return { device };
    },
    loanCreate: async (
      obj,
      { input: { loandate, dueDate, devIdCode, loaner } },
      { currentUser }
    ) => {
      const loan = await prisma.createLoan({
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
    }
  }
};
