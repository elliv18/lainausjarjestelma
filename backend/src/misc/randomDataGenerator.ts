import * as faker from "faker";
import { prisma } from "../generated/prisma-client";
import logger from "../misc/logger";
import { SALT_ROUNDS } from "../environment";
import * as bcrypt from "bcryptjs";

export default async (amount: number) => {
  if (
    (await prisma
      .usersConnection()
      .aggregate()
      .count()) < 1
  ) {
    process.stdout.write("Generating random test data");
    for (let i = 0; i < amount; i += 1) {
      // make new staffs
      const user = await prisma.createUser({
        isActive: true,
        userType: "STAFF",
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: faker.address.secondaryAddress(),
        personNumber: faker.random.number().toString(),
        phone: faker.phone.phoneNumber()
      });
      process.stdout.write(".");

      // make new students
      const userS = await prisma.createUser({
        isActive: true,
        userType: "STUDENT",
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: faker.address.secondaryAddress(),
        personNumber: faker.random.number().toString(),
        phone: faker.phone.phoneNumber()
      });
      process.stdout.write(".");

      // make new category
      const cat = await prisma.createCategory({
        deviceCategory: faker.commerce.product() + i.toString(),
        desription: faker.lorem.words(10)
      });
      process.stdout.write(".");

      // make new device
      const dev = await prisma.createDevice({
        idCode: faker.random.number().toString() + i.toString(),
        manufacture: faker.commerce.productName(),
        model: faker.commerce.productMaterial(),
        info: faker.lorem.words(10),
        loanStatus: false,
        categoryId: {
          connect: { deviceCategory: cat.deviceCategory }
        }
      });
      process.stdout.write(".");

      // make new loan
      await prisma.createLoan({
        isActive: true,
        loanDate: faker.date.past(),
        dueDate: faker.date.future(),
        deviceId: {
          connect: { id: dev.id }
        },
        loanerId: {
          connect: { id: userS.id }
        },
        supplierId: {
          connect: { id: user.id }
        }
      });

      await prisma.updateDevice({
        data: {
          loanStatus: true
        },
        where: {
          id: dev.id
        }
      });
      process.stdout.write(".");
    }
    console.log("faker data created!");
  }
};
