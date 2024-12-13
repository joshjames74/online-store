import { postHelper } from "@/api/helpers/request";
import { postUser } from "@/api/services/userService";
import { Usr } from "@prisma/client";
import { NextResponse } from "next/server";

// POST request
export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const user: Omit<Usr, "user_id"> = body;

  return await postHelper("usr", postUser, user);
}
