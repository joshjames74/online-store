import { getHelper, postHelper } from "@/api/helpers/request";
import { getReviewsBySearch, postReview } from "@/api/services/reviewService";
import { ReviewFilter, ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { Review } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET request

export async function GET(req: NextRequest): Promise<NextResponse> {

  const { searchParams } = new URL(req.url);

  const productId = parseInt(searchParams.get('productId') || '');
  const review_filter_raw = parseInt(searchParams.get('review_filter') || '');

  var review_filter: ReviewFilter;

  if (review_filter_raw && Object.values(ReviewFilter).includes(review_filter_raw as ReviewFilter)) {
    review_filter = review_filter_raw as ReviewFilter;
  };

  const params: Partial<ReviewParams> = { productId, review_filter }  

  return getHelper(getReviewsBySearch, params)
};


// POST request

export async function POST(req: Request): Promise<NextResponse> {

  const body = await req.json();
  const review: Omit<Review, 'review_id'> = body;

  return await postHelper('review', postReview, review);
}