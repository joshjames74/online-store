import { getHelper } from "@/api/helpers/request";
import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrderViewsBySearch } from "@/api/services/orderService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const { searchParams } = new URL(req.url);
  const parsedParams = parseOrderSearchParams(searchParams);

  return await getHelper(getOrderViewsBySearch, {
    usrId: id,
    ...parsedParams,
  });
}
