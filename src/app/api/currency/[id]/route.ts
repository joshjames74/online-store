import { NextRequest, NextResponse } from "next/server";
import { getCurrencyById } from "@/api/services/currencyService";
import { getHelper } from "@/api/helpers/request";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return getHelper(getCurrencyById, parseInt(id));
}
