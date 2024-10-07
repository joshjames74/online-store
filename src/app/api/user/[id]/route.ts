import { NextRequest, NextResponse } from 'next/server';
import { getCountryById } from '../../../../api/services/countryService';
import { getHelper } from '@/api/helpers/request';
import { getUserById } from '@/api/services/userService';

interface Params {
  id: string;
}


// GET method

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  return await getHelper('user', getUserById, parseInt(id));
}


