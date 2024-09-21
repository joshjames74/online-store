// global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// This is necessary to avoid errors when importing in TypeScript files.
export {};
