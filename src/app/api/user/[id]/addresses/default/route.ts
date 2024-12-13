import { putHelper } from "@/api/helpers/request";
import { putUserDefaultAddress } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

// PUT method

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const body = await req.json();
  const { addressId }: { addressId: number } = body;

  if (!addressId || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid Address Id" }, { status: 400 });
  }

  const userId = parseInt(id);
  const putParams = { userId, addressId };

  return await putHelper("usr", putUserDefaultAddress, { params: putParams });
}
