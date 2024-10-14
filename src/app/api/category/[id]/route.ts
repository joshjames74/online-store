import { getHelper } from "@/api/helpers/request";
import { getCategoryById } from "@/api/services/categoryService";
import { NextRequest, NextResponse } from "next/server";


// GET method


export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {

    const { id } = params;
  
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
  
    return getHelper(getCategoryById, parseInt(id))
  }