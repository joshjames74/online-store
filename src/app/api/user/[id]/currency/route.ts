import { putHelper } from "@/api/helpers/request";
import { putUserCurrencyById } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const { currencyId } = body;

  if (!currencyId || isNaN(parseInt(currencyId))) {
    return NextResponse.json({ error: "Invalid countryId" }, { status: 400 });
  }

  return await putHelper("usr", putUserCurrencyById, {
    params: {
      id: parseInt(id),
      currencyId: parseInt(currencyId),
    },
  });
}
