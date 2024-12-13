import { postHelper } from "@/api/helpers/request";
import { postAddress } from "@/api/services/addressService";
import { Address } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const address: Omit<Address, "id"> = body;

  address.countryId = parseInt(address.countryId.toString());
  address.usrId = parseInt(address.usrId.toString());

  return postHelper("address", postAddress, address);
}
