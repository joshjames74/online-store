import { NextRequest, NextResponse } from "next/server";
import { deleteHelper, getHelper } from "@/api/helpers/request";
import { deleteUserById, getUserById } from "@/api/services/userService";

// GET method

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await getHelper(getUserById, id);
}

// DELETE method

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;
  return await deleteHelper("usr", deleteUserById, id);
}
