import prisma from "@/lib/prisma";
import { Currency } from "@prisma/client";
import { getOneEntityByFields, getAllEntities } from "../helpers/dynamicQuery";

// GET methods

export async function getCurrencyById(id: number): Promise<Currency | void> {
  return getOneEntityByFields({
    modelName: "currency",
    whereQuery: { id: id },
  });
}

export async function getAllCurrencies(): Promise<Currency[] | void> {
  return getAllEntities("currency");
}
