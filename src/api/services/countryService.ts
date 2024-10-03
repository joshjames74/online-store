import prisma from "@/lib/prisma";
import { Country } from "@prisma/client";


// Using dynamic filtering
export async function getCountry(
  filter: Partial<{ id: number; code: string }>
): Promise<Country | null> {
  try {
    const country = await prisma.country.findFirst({
      where: {
        ...(filter.id && { country_id: filter.id }),
        ...(filter.code && { code: filter.code.toUpperCase() })
      },
    });

    return country;
  } catch (error) {
    console.error('Error fetching country:', error);
    throw new Error('Database error');
  }
}

// Wrapper function to get a country by ID
export async function getCountryById(id: number): Promise<Country | null> {
  return getCountry({ id });
}

// Wrapper function to get a country by code
export async function getCountryByCode(code: string): Promise<Country | null> {
  return getCountry({ code });
}


export async function getAllCountries(): Promise<Country[] | null> {
    try {
        const countries = await prisma.country.findMany({
            where: {}
        });

        return countries
    } catch (error) {
        console.error('Error fetching country:', error);
        throw new Error('Database error');
    }
}