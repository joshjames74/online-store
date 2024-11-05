import { getHelper, postHelper } from "@/api/helpers/request";
import { getUserByEmail } from "@/api/services/userService";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { email: string }}): Promise<NextResponse> {
    const { email } = params;
    return getHelper(getUserByEmail, email);
};