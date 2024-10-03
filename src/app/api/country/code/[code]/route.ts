// app/api/country/code/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCountryByCode } from '../../../../../api/services/countryService';

interface Params {
  code: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { code } = params;

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  try {
    const country = await getCountryByCode(code);

    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json(country, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
