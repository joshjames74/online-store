import { Currency } from "@prisma/client";
import { fetchData } from ".";

// GET methods

export async function getCurrencyById(id: number): Promise<Currency> {
  return fetchData<Currency>(`/api/currency/${id}`, "force-cache");
}

export async function getAllCurrencies(): Promise<Currency[]> {
  return fetchData<Currency[]>(`/api/currency/all`, "force-cache");
}
