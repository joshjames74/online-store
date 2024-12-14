import { putHelper } from "@/api/helpers/request";
import { putUserCurrencyById } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const body = await req.json();
  const { currencyId } = body;

  if (!currencyId || isNaN(parseInt(currencyId))) {
    return NextResponse.json({ error: "Invalid countryId" }, { status: 400 });
  }

  return await putHelper("usr", putUserCurrencyById, {
    params: {
      id: id,
      currencyId: parseInt(currencyId),
    },
  });
}
