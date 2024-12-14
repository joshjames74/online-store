import { putHelper } from "@/api/helpers/request";
import { putUserDefaultAddress } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

// PUT method

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const body = await req.json();
  const { addressId } = body;

  if (!addressId || isNaN(Number(addressId))) {
    return NextResponse.json({ error: "Invalid Address Id" }, { status: 400 });
  }

  return await putHelper("usr", putUserDefaultAddress, {
    params: {
      userId: id,
      addressId: parseInt(addressId),
    },
  });
};
