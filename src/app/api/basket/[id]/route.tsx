import {
  FieldValuePair,
  formatBodyToField,
  putHelper,
} from "@/api/helpers/request";
import { putBasketItemByQuantity } from "@/api/services/basketItemService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const { quantity } = body;

  if (!quantity || isNaN(parseInt(quantity))) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  return putHelper("basketItem", putBasketItemByQuantity, {
    params: {
      id: parseInt(id),
      quantity: parseInt(quantity),
    },
  });
}
