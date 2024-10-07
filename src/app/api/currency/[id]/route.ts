import { NextRequest, NextResponse } from 'next/server';
import { getCurrencyById } from '@/api/services/currencyService';
import { getHelper } from '@/api/helpers/request';

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {

  // validate params
  const { id } = params;
  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // get and send response
  return getHelper('currency', getCurrencyById, parseInt(id))

}