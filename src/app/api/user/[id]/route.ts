import { NextRequest, NextResponse } from "next/server";
import {
  deleteHelper,
  FieldValuePair,
  formatBodyToField,
  getHelper,
  putHelper,
} from "@/api/helpers/request";
import {
  deleteUserById,
  getUserById,
  putUserByFields,
} from "@/api/services/userService";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return await getHelper(getUserById, parseInt(id));
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

  return await deleteHelper("usr", deleteUserById, parseInt(id));
}

// PUT method

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const body = await req.json();

  const searchField: FieldValuePair<"usr"> = {
    field: "id",
    value: parseInt(id),
  };
  const putFields = formatBodyToField<"usr">(body);

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const putParams = { searchField, putFields };

  return await putHelper("usr", putUserByFields, { params: putParams });
}
