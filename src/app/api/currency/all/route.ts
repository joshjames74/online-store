import { getHelper } from "@/api/helpers/request";
import { getAllCurrencies } from "@/api/services/currencyService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getHelper(getAllCurrencies, null);
}
