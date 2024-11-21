import { Currency } from "@prisma/client";

export async function getCurrencyById(id: number): Promise<Currency> {
  const response = await fetch(`/api/currency/${id}`, {
    method: "GET",
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error fetching currency");
  }
  return response.json();
}

export async function getAllCurrencies(): Promise<Currency[]> {
  const response = await fetch(`/api/currency/all`, {
    method: "GET",
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error fetching currencies");
  }
  return response.json();
}
