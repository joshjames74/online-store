const { PrismaClient } = require("@prisma/client");
const { readFile } = require("fs/promises");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE Country RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Currency RESTART IDENTITY CASCADE`;
  //await prisma.$executeRaw`TRUNCATE TABLE User RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Category RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Product RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE Address RESTART IDENTITY CASCADE`;
  //await prisma.$executeRaw`TRUNCATE TABLE Order RESTART IDENTITY CASCADE`;
  //await prisma.$executeRaw`TRUNCATE TABLE BasketItem RESTART IDENTITY CASCADE`;
  //await prisma.$executeRaw`TRUNCATE TABLE OrderItem RESTART IDENTITY CASCADE`;

  // set up sql files
  const country_sql = await readFile("../database/country.sql", {
    encoding: "utf8",
  });
  const currency_sql = await readFile("../database/currency.sql", {
    encoding: "utf8",
  });
  const user_sql = await readFile("../database/user.sql", { encoding: "utf8" });
  const category_sql = await readFile("../database/category.sql", {
    encoding: "utf8",
  });
  const product_sql = await readFile("../database/product.sql", {
    encoding: "utf8",
  });
  const product_category_sql = await readFile(
    "../database/product-category.sql",
    { encoding: "utf8" },
  );
  const review_sql = await readFile("../database/review.sql", {
    encoding: "utf8",
  });
  const address_sql = await readFile("../database/address.sql", {
    encoding: "utf8",
  });
  const order_sql = await readFile("../database/order.sql", {
    encoding: "utf8",
  });
  const orderItem_sql = await readFile("../database/orderItem.sql", {
    encoding: "utf8",
  });
  const basketItem_sql = await readFile("../database/basket-item.sql", {
    encoding: "utf8",
  });

  // Add known seed data
  await prisma.$executeRawUnsafe(country_sql);
  await prisma.$executeRawUnsafe(currency_sql);
  await prisma.$executeRawUnsafe(user_sql);
  await prisma.$executeRawUnsafe(category_sql);
  await prisma.$executeRawUnsafe(product_sql);
  await prisma.$executeRawUnsafe(product_category_sql);
  await prisma.$executeRawUnsafe(review_sql);
  await prisma.$executeRawUnsafe(address_sql);
  await prisma.$executeRawUnsafe(order_sql);
  await prisma.$executeRawUnsafe(orderItem_sql);
  await prisma.$executeRawUnsafe(basketItem_sql);
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
