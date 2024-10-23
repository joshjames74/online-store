import { putOneEntityByField } from "@/api/helpers/dynamicQuery";
import { FieldValuePair, formatBodyToField, putHelper } from "@/api/helpers/request";
import { putBasketItemByFields } from "@/api/services/basketItemService";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {

    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    };

    const body = await req.json();

    const searchField: FieldValuePair<'basketItem'> = { field: 'id', value: parseInt(id) }
    const putFields = formatBodyToField<'basketItem'>(body);

    return putHelper('basketItem', putBasketItemByFields, searchField, putFields);
};
  