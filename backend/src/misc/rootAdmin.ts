import { prisma } from "../generated/prisma-client";
import * as bcrypt from "bcryptjs";
import { JWT_SECRET, SALT_ROUNDS } from "../environment";

export default async () => {
  // is db empty?
  if (
    (await prisma
      .usersConnection()
      .aggregate()
      .count()) < 1
  ) {
    await prisma.createUser({
      isActive: true,
      userType: "ADMIN",
      email: "1",
      password: await bcrypt.hash("1", SALT_ROUNDS),
      firstName: "Root",
      lastName: "Admin",
      address: "server",
      personNumber: "127.0.0.1",
      phone: "127.0.0.1"
    });
    console.log("Root Admin Created!!!");
  }
};
