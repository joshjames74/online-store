import { NextRequest, NextResponse } from 'next/server';
import { getCountryById } from '../../../../api/services/countryService';
import { getHelper } from '@/api/helpers/request';


// GET method

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }


  return await getHelper('country', getCountryById, parseInt(id))
}
