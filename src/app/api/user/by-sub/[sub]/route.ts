import { getHelper } from "@/api/helpers/request";
import { getUserByEmail, getUserBySub } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

// GET method
export async function GET(
  req: NextRequest,
  { params }: { params: { sub: string } },
): Promise<NextResponse> {
  const { sub } = params;
  return getHelper(getUserBySub, sub);
}
