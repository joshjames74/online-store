import {
  deleteHelper,
  FieldValuePair,
  formatBodyToField,
  getHelper,
  putHelper,
} from "@/api/helpers/request";
import {
  deleteProductById,
  getProductById,
  putProductByFields,
} from "@/api/services/productService";
import { NextRequest, NextResponse } from "next/server";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return await getHelper(getProductById, parseInt(id));
}

// DELETE method

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return await deleteHelper("product", deleteProductById, parseInt(id));
}

// PUT method

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const body = await req.json();

  const searchField: FieldValuePair<"product"> = {
    field: "id",
    value: parseInt(id),
  };
  const putField = formatBodyToField<"product">(body);

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return await putHelper("product", putProductByFields, searchField, putField);
}
