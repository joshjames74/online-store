import { deleteHelper } from "@/api/helpers/request";
import { deleteBasketItemById } from "@/api/services/basketItemService";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return deleteHelper("basketItem", deleteBasketItemById, id);
}
