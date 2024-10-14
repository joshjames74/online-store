import { getHelper } from "@/api/helpers/request";
import { getAllCategories } from "@/api/services/categoryService";
import { NextRequest, NextResponse } from "next/server";


// GET method

export async function GET(req: NextRequest): Promise<NextResponse> {
    return getHelper(getAllCategories, null);
  }