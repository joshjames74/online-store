import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

async function main() {

  // // Delete existing data to start fresh
  // await prisma.country.deleteMany();
  // await prisma.currency.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.basket.deleteMany();

  // to do: reset seed
  const truncate_all_tables = await readFile('../online-store/src/database/truncate-all-tables.sql', { encoding: 'utf8'});
  await prisma.$executeRawUnsafe(truncate_all_tables);


  // set up sql files
  const country_sql = await readFile('../online-store/src/database/country.sql', { encoding: 'utf8'});
  const currency_sql = await readFile('../online-store/src/database/currency.sql', { encoding: 'utf8'});

  // Add known seed data
  await prisma.$executeRawUnsafe(country_sql);
  await prisma.$executeRawUnsafe(currency_sql);

  // await prisma.currency.create({data: {code: "GBP", symbol: "£", gbp_exchange_rate: 1}})

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