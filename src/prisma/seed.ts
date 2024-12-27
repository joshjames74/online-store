import {
  generateMockAddress,
  generateMockBasketItem,
  generateMockOrder,
  generateMockOrderItem,
  generateMockProduct,
  generateMockProductCategories,
  generateMockReview,
  generateMockUser,
} from "@/tests/generate";
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  const userCount = 20;
  const productCount = 20;
  const reviewCount = 300;
  const addressCount = 20;
  const orderCount = 20;
  const orderItemCount = 100;
  const basketItemCount = 100;

  await prisma.$executeRaw`TRUNCATE TABLE Country RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Currency RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Category RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Product RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Address RESTART IDENTITY CASCADE`;

  await prisma.usrAuth.deleteMany({});


  // set up sql files
  const country_sql = await readFile("../database/country.sql", {
    encoding: "utf8",
  });
  const currency_sql = await readFile("../database/currency.sql", {
    encoding: "utf8",
  });
  const category_sql = await readFile("../database/category.sql", {
    encoding: "utf8",
  });

  // Add known seed data
  await prisma.$executeRawUnsafe(country_sql);
  console.log("Created countries");
  await prisma.$executeRawUnsafe(currency_sql);
  console.log("Created currencies");
  await prisma.$executeRawUnsafe(category_sql);
  console.log("Created categories");

  const countryIds = Array.from({ length: 100 }, (_, i) => i + 1);
  const currencyIds = Array.from({ length: 100 }, (_, i) => i + 1);
  const categoryIds = Array.from({ length: 20 }, (_, i) => i + 1);

  const mockUsers = Array.from({ length: userCount }, generateMockUser);
  const users = await prisma.usr.createManyAndReturn({ data: mockUsers });
  const userIds = users.map((user) => user.id);
  console.log("Created users");

  const mockProducts = Array.from({ length: productCount }, () =>
    generateMockProduct(userIds),
  );
  const products = await prisma.product.createManyAndReturn({
    data: mockProducts,
  });
  const productIds = products.map((product) => product.id);
  console.log("Created products");

  const mockReviews = Array.from({ length: reviewCount }, () =>
    generateMockReview(productIds, userIds),
  );
  const reviews = await prisma.review.createManyAndReturn({
    data: mockReviews,
  });
  const reviewIds = reviews.map((review) => review.id);
  console.log("Created reviews");

  const mockAddresses = Array.from({ length: addressCount }, () =>
    generateMockAddress(userIds, countryIds),
  );
  const addresses = await prisma.address.createManyAndReturn({
    data: mockAddresses,
  });
  const addressIds = addresses.map((address) => address.id);
  console.log("Created addresses");

  const mockProductCategories = generateMockProductCategories(
    productIds,
    categoryIds,
  );
  const productCategories = await prisma.productCategory.createManyAndReturn({
    data: mockProductCategories,
  });
  console.log("Created product categories");

  const mockOrders = Array.from({ length: orderCount }, () =>
    generateMockOrder(userIds, addressIds, currencyIds),
  );
  const orders = await prisma.order.createManyAndReturn({ data: mockOrders });
  const orderIds = orders.map((order) => order.id);
  console.log("Created orders");

  const mockOrderItems = Array.from({ length: orderItemCount }, () =>
    generateMockOrderItem(orderIds, productIds),
  );
  const orderItems = await prisma.orderItem.createManyAndReturn({
    data: mockOrderItems,
  });
  const orderItemIds = orderItems.map((orderItem) => orderItem.id);
  console.log("Created order items");

  const mockBasketItems = Array.from({ length: basketItemCount }, () =>
    generateMockBasketItem(productIds, userIds),
  );
  const basketItems = await prisma.basketItem.createManyAndReturn({
    data: mockBasketItems,
  });
  const basketItemIds = basketItems.map((basketItem) => basketItem.id);
  console.log("Created basket items");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
