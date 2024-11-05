import { postHelper } from "@/api/helpers/request";
import { findOrPostUser, postUser, upsertUserByEmail } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest): Promise<NextResponse> {

    const body = await req.json();
    const { email, name, image: image_url }: { email: string, name: string, image: string} = body;

    return postHelper('usr', postUser, { email, name, image_url });
};