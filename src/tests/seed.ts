import prisma from "@/lib/prisma";
import { generateMockProducts } from "./generate";
import { faker } from "@faker-js/faker";

// export const seedDatabase = async () => {
//     faker.seed(123);
//     const mockProducts = generateMockProducts(10);
//     for (const product of mockProducts) {
//         await prisma.product.create({ data: product });
//     }
// }

export {};
