import { prisma } from "../generated/prisma-client";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../environment";

export default {
  Query: {
    currentUser: async (obj, args, req) => {
      return await prisma.user({ id: req.id });
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
      const users = await prisma.users();
      console.log(users);
      return users;
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
          isActive,
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
    categoryCreate: async (obj, { input: { deviceType, manufacture } }) => {
      const devCat = await prisma.createDevCategory({
        deviceType: deviceType,
        manufacture: manufacture
      });
      console.log(devCat);
      return { devCat };
    }
  }
};
