import { getHelper } from "@/api/helpers/request";
import { getAllProducts } from "@/api/services/productService";
import { NextRequest, NextResponse } from "next/server";

// GET request

export async function GET(req: NextRequest): Promise<NextResponse> {
  return await getHelper(getAllProducts, {});
}
