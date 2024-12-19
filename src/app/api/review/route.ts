import { getHelper, postHelper } from "@/api/helpers/request";
import { getReviewsBySearch, postReview } from "@/api/services/reviewService";
import {
  ReviewFilter,
  ReviewParams,
} from "@/api/transformers/reviewSearchTransformer";
import { Review } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET request

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const productId = parseInt(searchParams.get("productId") || "");
  const score = parseInt(searchParams.get("score") || "");
  const review_filter = parseInt(searchParams.get("review_filter") || "");
  const perPage = parseInt(searchParams.get("perPage") || "");
  const pageNumber = parseInt(searchParams.get("pageNumber") || "");

  const params: Partial<ReviewParams> = {
    productId,
    review_filter,
    score,
    perPage,
    pageNumber,
  };

  return getHelper(getReviewsBySearch, params);
}

// POST request

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const review: Omit<Review, "review_id"> = body;

  review.score = parseInt(review.score?.toString() || "");
  review.usrId = review.usrId;
  review.productId = parseInt(review.productId?.toString() || "");

  return await postHelper("review", postReview, review);
}
