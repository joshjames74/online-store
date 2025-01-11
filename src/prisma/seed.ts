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
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  const userCount = 20;
  const productCount = 5;
  const reviewCount = 5;
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

  // Create users
  const mockUsers = Array.from({ length: userCount }, generateMockUser);
  const users = await prisma.usr.createManyAndReturn({ data: mockUsers });
  const userIds = users.map((user) => user.id);
  console.log("Created users");

  // Create addresses
  const mockAddresses = Array.from({ length: addressCount }, () =>
    generateMockAddress(userIds, countryIds),
  );
  const addresses = await prisma.address.createManyAndReturn({
    data: mockAddresses,
  });
  const addressIds = addresses.map((address) => address.id);
  console.log("Created addresses");


  // create products
  let productIds: number[] = [];
  for (let i = 0; i < productCount; i++) {

    const productReviewCount = faker.number.int({ min: 1, max: reviewCount });

    // mock product and reviews
    const mockProduct = generateMockProduct(userIds);
    const mockReviews = Array.from({ length: productReviewCount }, () => generateMockReview([1], userIds));

    // compute average score
    const total = mockReviews.reduce((prev, curr) => prev + curr.score, 0);
    const average = Math.round(total / productReviewCount * 100) / 100;

    // update product
    mockProduct.review_score = average;
    mockProduct.review_count = productReviewCount;

    // save product
    const product = await prisma.product.createManyAndReturn({ data: mockProduct });
    const productId = product[0].id;

    productIds.push(productId);

    // create reviews
    const updatedMockReviews = mockReviews.map(review => {
      review.productId = productId;
      return review;
    });
    const reviews = await prisma.review.createManyAndReturn({ data: updatedMockReviews });
  };
  

  // create product category relations 
  const mockProductCategories = generateMockProductCategories(
    productIds,
    categoryIds,
  );
  const productCategories = await prisma.productCategory.createManyAndReturn({
    data: mockProductCategories,
  });
  console.log("Created product categories");


  // create orders
  const mockOrders = Array.from({ length: orderCount }, () =>
    generateMockOrder(userIds, addressIds, currencyIds),
  );
  const orders = await prisma.order.createManyAndReturn({ data: mockOrders });
  const orderIds = orders.map((order) => order.id);
  console.log("Created orders");


  // create orderitems
  const mockOrderItems = Array.from({ length: orderItemCount }, () =>
    generateMockOrderItem(orderIds, productIds),
  );
  const orderItems = await prisma.$transaction(async (tx) => {

    // save orderItems
    const orderItems = await tx.orderItem.createManyAndReturn({
      data: mockOrderItems
    });

    const quantityMap = new Map<number, number>();
    for (const { productId, quantity } of orderItems) {
      quantityMap.set(
        productId,
        (quantityMap.get(productId) || 0) + quantity
      );
    };

    // update product quantities
    for (const [productId, quantity] of quantityMap) {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { order_count: { increment: quantity } }
      });
    };

    return orderItems;
  });
  const orderItemIds = orderItems.map((orderItem) => orderItem.id);
  console.log("Created order items");

  // create basketItems
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
