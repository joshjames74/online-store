import { getHelper, postHelper } from "@/api/helpers/request";
import { getAllProducts, postProduct } from "@/api/services/productService";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET request

export async function GET(req: NextRequest): Promise<NextResponse> {
  return await getHelper(getAllProducts, null);
}
