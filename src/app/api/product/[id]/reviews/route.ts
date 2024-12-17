import { getHelper } from "@/api/helpers/request";
import {
  getReviewsByProductId,
  getReviewsBySearch,
} from "@/api/services/reviewService";
import { ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  const { searchParams } = new URL(req.url);

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const score = parseInt(searchParams.get("score") || "");
  const review_filter = parseInt(searchParams.get("review_filter") || "");
  const perPage = parseInt(searchParams.get("perPage") || "");
  const pageNumber = parseInt(searchParams.get("pageNumber") || "");

  const reviewParams: Partial<ReviewParams> = {
    review_filter,
    score,
    productId: parseInt(id),
    perPage: perPage,
    pageNumber: pageNumber,
  };

  return getHelper(getReviewsBySearch, reviewParams);
}
