import { getHelper } from "@/api/helpers/request";
import { getUserAuthById } from "@/api/services/userAuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getUserAuthById, id);
}
