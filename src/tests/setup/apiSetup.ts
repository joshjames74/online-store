import prisma from "@/lib/prisma";
import Seed, { SeedConfig } from "@/prisma/seed";


const config: SeedConfig = {
  userCount: 2,
  productCount: 10,
  reviewCount: 2,
  orderCount: 0,
  orderItemCount: 0,
  basketItemCount: 0,
  productCategoriesCount: 0,
  addressCount: 0,
};

const deleteAllData = async () => {
  
  const seed = new Seed(config);
  seed.deleteAllEntities();

};

beforeAll(async () => {
  await deleteAllData();
});

afterAll(async () => {
  await prisma.$disconnect();
});

global.console = {
  ...global.console,
  log: jest.fn(console.log), // Enable console log in Jest
};
