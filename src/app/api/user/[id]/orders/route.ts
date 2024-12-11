import { getHelper } from "@/api/helpers/request";
import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrderViewsBySearch } from "@/api/services/orderService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const parsedParams = parseOrderSearchParams(searchParams);

  console.log("Running");

  return await getHelper(getOrderViewsBySearch, {
    usrId: parseInt(id),
    ...parsedParams,
  });
}
