import { prisma } from "../generated/prisma-client";
import * as bcrypt from "bcryptjs";
import {
  ROOT_ADMIN_EMAIL,
  ROOT_ADMIN_PASS,
  ROOT_ADMIN_FIRST_NAME,
  ROOT_ADMIN_LAST_NAME,
  ROOT_ADMIN_ADDRESS,
  ROOT_ADMIN_PERSON_NUMBER,
  ROOT_ADMIN_PHONE,
  SALT_ROUNDS
} from "../environment";
import logger from "./logger";

export default async () => {
  // is db empty?
  if (
    (await prisma
      .usersConnection()
      .aggregate()
      .count()) < 1 ||
    (await prisma.user({ email: ROOT_ADMIN_EMAIL })) === null
  ) {
    await prisma.createUser({
      isActive: true,
      userType: "ADMIN",
      email: ROOT_ADMIN_EMAIL,
      password: await bcrypt.hash(ROOT_ADMIN_PASS, SALT_ROUNDS),
      firstName: ROOT_ADMIN_FIRST_NAME,
      lastName: ROOT_ADMIN_LAST_NAME,
      address: ROOT_ADMIN_ADDRESS,
      personNumber: ROOT_ADMIN_PERSON_NUMBER,
      phone: ROOT_ADMIN_PHONE
    });

    logger.log("info", "[USER CREATE] Root admin have been created");
  }
};
