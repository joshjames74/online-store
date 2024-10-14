import { getHelper } from "@/api/helpers/request";
import { getReviewsByProductId } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";


// GET method

export async function GET(res: NextRequest, { params }:  { params: { id: string } }): Promise<NextResponse> {
    
    const { id } = params;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    return await getHelper(getReviewsByProductId, parseInt(id));
}