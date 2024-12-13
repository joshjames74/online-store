// import { PrismaClient } from "@prisma/client";

// require('dotenv').config();

// let prisma: PrismaClient;

// // declare global {
// //   namespace NodeJS {
// //     interface Global {
// //       prisma: any;
// //     }
// //   }
// // }

// if (process.env.NODE_ENV === "production") {
//   // In production, we want to create a new instance of PrismaClient.
//   prisma = new PrismaClient();
// } else {
//   //In development, we want to reuse the same instance across hot-reloads.
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient();
//   }

//   //global.prisma = new PrismaClient();
//   prisma = (global as any).prisma;
// }

// export default prisma;
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
