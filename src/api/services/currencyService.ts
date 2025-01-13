import prisma from "@/lib/prisma";
import { Currency } from "@prisma/client";

// GET methods

export async function getCurrencyById(id: number): Promise<Currency | null> {
  return prisma.currency.findFirst({
    where: { id: id },
  });
}

export async function getAllCurrencies(): Promise<Currency[] | void> {
  return prisma.currency.findMany({
    orderBy: { code: "asc" },
  });
}
