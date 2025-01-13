import { deleteHelper, getHelper } from "@/api/helpers/request";
import { deleteReviewById, getReviewById } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getReviewById, id);
}

// DELETE method

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await deleteHelper("review", deleteReviewById, id);
}
