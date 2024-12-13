import { Country } from "@prisma/client";
import { fetchData } from ".";

export async function getAllCountries(
  cache?: RequestCache,
): Promise<Country[]> {
  return fetchData<Country[]>("/api/country/all", cache);
}

export async function getCountryById(id: number, cache?: RequestCache): Promise<Country> {
  return fetchData<Country>(`/api/country/${id}`, cache);
}