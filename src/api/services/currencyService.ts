import prisma from "@/lib/prisma";
import { Currency } from "@prisma/client";
import { getOneEntityByField, getAllEntity } from "../helpers/dynamicQuery";

// GET methods

export async function getCurrencyById(id: number): Promise<Currency | void> {
  return getOneEntityByField({
    modelName: "currency",
    whereQuery: { id: id },
  });
}

export async function getAllCurrencies(): Promise<Currency[] | void> {
  return getAllEntity("currency");
}
