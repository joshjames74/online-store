import { getHelper } from "@/api/helpers/request";
import { getReviewsByUserId } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getReviewsByUserId, id);
}
