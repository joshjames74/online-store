import { putHelper } from "@/api/helpers/request";
import { putUserCountryById } from "@/api/services/userService";
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
  const { countryId } = body;

  if (!countryId || isNaN(parseInt(countryId))) {
    return NextResponse.json({ error: "Invalid countryId" }, { status: 400 });
  }

  return await putHelper("usr", putUserCountryById, {
    params: {
      id: parseInt(id),
      countryId: parseInt(countryId),
    },
  });
}
