import { getHelper } from "@/api/helpers/request";
import { getProductByUserId } from "@/api/services/productService";
import { getReviewsByUserId } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return await getHelper("review", getReviewsByUserId, parseInt(id));
}
