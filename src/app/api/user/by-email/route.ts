import { postHelper } from "@/api/helpers/request";
import { findOrPostUser, upsertUserByEmail } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest): Promise<NextResponse> {

    const body = await req.json();
    const { email, name, image: image_url } = body;

    return postHelper('usr', upsertUserByEmail, { email, name, image_url });
};