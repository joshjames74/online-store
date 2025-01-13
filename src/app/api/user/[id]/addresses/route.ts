import { getHelper } from "@/api/helpers/request";
import { getAddressesByUserId } from "@/api/services/addressService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getAddressesByUserId, id);
}
