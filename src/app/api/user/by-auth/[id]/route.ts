import { getHelper } from "@/api/helpers/request";
import { getUserByAuthId } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getUserByAuthId, id);
}
