import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

interface Params {
    id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params}) {

    const { id } = params
    
    if (typeof id !== 'string') {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const country = await prisma.country.findUnique({
            where: {
                country_id: parseInt(id)
            }
        })

        if (!country) {
            return NextResponse.json({ error: 'Country not found'}, { status: 404});
        }

        return NextResponse.json(country, { status: 200});
    } catch (error) {
        console.error('Error fetching country:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500});
    }
}
