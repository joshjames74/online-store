import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production, we want to create a new instance of PrismaClient.
  prisma = new PrismaClient();
} else {
  // In development, we want to reuse the same instance across hot-reloads.
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
