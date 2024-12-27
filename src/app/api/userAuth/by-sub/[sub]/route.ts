import { getHelper } from "@/api/helpers/request";
import { getUserAuthBySub } from "@/api/services/userAuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { sub: string } },
): Promise<NextResponse> {
  const { sub } = params;
  return await getHelper(getUserAuthBySub, sub);
}
