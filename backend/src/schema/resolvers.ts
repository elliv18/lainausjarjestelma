import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import { prisma } from "../generated/prisma-client";
import { JWT_SECRET, SALT_ROUNDS } from "../environment";

export default {
  Query: {
    currentUser: async (obj, args, { currentUser }) => {
      return await prisma.user({ id: currentUser.id });
    },
    login: async (obj, { input: { email, password } }) => {
      const user = await prisma.user({ email: email });
      console.log(user);
      if (!user) {
        throw new Error("Email not found!");
      }

      //const pwValid = await bcrypt.compare(password, user.password);

      /*if (!pwValid) {
        throw new Error("Password is invalid!");
      }*/

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET);

      return { jwt };
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
    // not working
    ownLoans: async (obj, args, { currentUser }) => {
      return await prisma.loans({ where: { loanerId: currentUser.id } });
    }
  },
  Mutation: {
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
      const pw = await bcrypt.hash(password, SALT_ROUNDS);

      console.log(pw);
      // not load
      const user = await prisma.createUser({
        isActive: isActive,
        userType: userType,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        personNumber: personNumber,
        phone: phone
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
        password: password,
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
    deviceCreate: async (
      obj,
      { input: { idCode, manufacture, model, info, devType } }
    ) => {
      const device = await prisma.createDevice({
        idCode: idCode,
        manufacture: manufacture,
        model: model,
        info: info,
        loanStatus: true,
        devCategoryId: {
          connect: { deviceType: devType }
        }
      });

      return { device };
    },
    loanCreate: async (
      obj,
      { input: loandate, dueDate, devIdCode, loaner },
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
        supplierId: currentUser.id
      });
    }
  }
};
