import prisma from "@/lib/prisma";
import { Country } from "@prisma/client";
import { getAllEntities, getOneEntityByFields } from "../helpers/dynamicQuery";

// GET methods

export async function getCountryById(id: number): Promise<Country | void> {
  return getOneEntityByFields({
    modelName: "country",
    whereQuery: { id: id },
  });
}

export async function getAllCountries(): Promise<Country[] | void> {
  return getAllEntities("country");
}
