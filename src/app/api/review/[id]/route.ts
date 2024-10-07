
// GET method

import { getHelper } from "@/api/helpers/request";
import { getReviewById } from "@/api/services/reviewService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {

    const { id } = params;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    return await getHelper('review', getReviewById, parseInt(id));
}