require("dotenv").config();
import prisma from "@/lib/prisma";

const deleteAllData = async () => {
  await prisma.basketItem.deleteMany({});

  // orderItem before order
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  await prisma.address.deleteMany({});

  // productCategory, then category
  await prisma.productCategory.deleteMany({});
  await prisma.category.deleteMany({});

  // review before product
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});

  await prisma.usr.deleteMany({});

  await prisma.currency.deleteMany({});
  await prisma.country.deleteMany({});
};

beforeAll(async () => {
  await deleteAllData();
});

afterAll(async () => {
  await prisma.$disconnect();
});
