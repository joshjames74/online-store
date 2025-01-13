import { getHelper } from "@/api/helpers/request";
import { getProductsByUserId } from "@/api/services/productService";
import { getReviewsByUserId } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  return await getHelper(getReviewsByUserId, id);
}
