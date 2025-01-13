import { deleteHelper, getHelper } from "@/api/helpers/request";
import {
  deleteAllBasketItemByUserId,
  getBasketByUserId,
} from "@/api/services/basketItemService";
import { NextRequest, NextResponse } from "next/server";


// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getBasketByUserId, id);
}


// DELETE method 

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  return await deleteHelper("basketItem", deleteAllBasketItemByUserId, id);
}
