import { NextRequest, NextResponse } from 'next/server';

interface Params {
    id: number;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
    return NextResponse.json({ message: `Param value is ${params.id}` });
}
