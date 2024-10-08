import prisma from "@/lib/prisma";
import { Country } from "@prisma/client";
import { getAllEntity, getOneEntityByField } from "../helpers/dynamicQuery";


// GET methods

export async function getCountryById(id: number): Promise<Country | void> {
  return getOneEntityByField('country', 'id', id);
}

export async function getAllCountries(): Promise<Country[] | void> {
  return getAllEntity('country');
}