import { getHelper } from "@/api/helpers/request";
import { getProductsByUserId } from "@/api/services/productService";
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

  return await getHelper(getProductsByUserId, parseInt(id));
}
