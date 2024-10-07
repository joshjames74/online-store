const { PrismaClient } = require('@prisma/client');
const { readFile } = require('fs/promises');

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
  const country_sql = await readFile('../database/country.sql', { encoding: 'utf8'});
  const currency_sql = await readFile('../database/currency.sql', { encoding: 'utf8'});

  // Add known seed data
  await prisma.$executeRawUnsafe(country_sql);
  await prisma.$executeRawUnsafe(currency_sql);

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