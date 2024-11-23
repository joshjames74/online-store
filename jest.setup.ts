// import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { generateMockProducts } from "@/tests/generate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// beforeEach(async () => {
//     execSync('npx ts-node prisma/seed.ts');
// })

// beforeAll(async () => {
//   // seed the db before the tests run
//   execSync("npx prisma db push");
//   execSync("npx --loader ts-node/esm src/prisma/seed.ts");
// });

afterAll(async () => {
  await prisma.$disconnect();
});

export {};
