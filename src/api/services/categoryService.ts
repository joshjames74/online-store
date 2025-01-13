import { Category } from "@prisma/client";
import prisma from "@/lib/prisma";

// GET functions

export async function getCategoryById(id: number): Promise<Category | null> {
  return await prisma.category.findFirst({
    where: { id: id },
  });
}

export async function getAllCategories(): Promise<Category[] | void> {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
