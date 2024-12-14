import prisma from "@/lib/prisma";
import { Country } from "@prisma/client";

// GET methods

export async function getCountryById(id: number): Promise<Country | null> {
  return prisma.country.findFirst({
    where: { id: id },
  });
}

export async function getAllCountries(): Promise<Country[] | void> {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
  });
}
