import { deleteHelper } from "@/api/helpers/request";
import { deleteBasketItemById } from "@/api/services/basketItemService";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { id: string }}): Promise<NextResponse> {

    const { id } = params;

    
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    };

    return deleteHelper('basketItem', deleteBasketItemById, parseInt(id));
}