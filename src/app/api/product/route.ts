import { getHelper, postHelper } from '@/api/helpers/request';
import { parseQueryParams } from '@/api/helpers/utils';
import { getProductBySearch, postProduct } from '@/api/services/productService';
import { QueryParams } from '@/redux/reducers/product';
import { Product } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


// GET request
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const searchData = parseQueryParams(searchParams);
  return getHelper('product', getProductBySearch, searchData)
};



// POST request

export async function POST(req: NextRequest): Promise<NextResponse> {

  const body = await req.json();
  const product: Omit<Product, 'product_id'> = body;

  return await postHelper('product', postProduct, product);
}