import { postHelper } from "@/api/helpers/request";
import { postReview } from "@/api/services/reviewService";
import { Review } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


// POST request

export async function POST(req: Request): Promise<NextResponse> {

  const body = await req.json();
  const review: Omit<Review, 'review_id'> = body;

  return await postHelper('review', postReview, review);
}