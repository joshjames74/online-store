import prisma from "@/lib/prisma";
import { Currency } from "@prisma/client";

// Using dynamic filtering
export async function getCurrency(
    filter: Partial<{ id: number; code: string }>
  ): Promise<Currency | null> {
    try {
      const currency = await prisma.currency.findFirst({
        where: {
          ...(filter.id && { currency_id: filter.id }),
          ...(filter.code && { code: filter.code.toUpperCase() })
        },
      });
  
      return currency;
    } catch (error) {
      console.error('Error fetching Currency:', error);
      throw new Error('Database error');
    }
  }
  
  // Wrapper function to get a Currency by ID
  export async function getCurrencyById(id: number): Promise<Currency | null> {
    return getCurrency({ id });
  }
  
  // Wrapper function to get a Currency by code
  export async function getCurrencyByCode(code: string): Promise<Currency | null> {
    return getCurrency({ code });
  }


  export async function getAllCurrencies(): Promise<Currency[] | null> {
    try {
        const currencies = await prisma.currency.findMany({
            where: {}
        });

        return currencies
    } catch (error) {
        console.error('Error fetching currencies:', error);
        throw new Error('Database error');
    }
}