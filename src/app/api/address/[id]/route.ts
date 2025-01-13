import { deleteHelper, getHelper } from "@/api/helpers/request";
import {
  deleteAddressById,
  getAddressById,
} from "@/api/services/addressService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getAddressById, id);
}

// DELETE method

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await deleteHelper("address", deleteAddressById, id);
}
