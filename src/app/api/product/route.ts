import { postHelper } from '@/api/helpers/request';
import { postProduct } from '@/api/services/productService';
import { Product } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


// POST request

export async function POST(req: NextRequest): Promise<NextResponse> {


  const body = await req.json();
  const product: Omit<Product, 'product_id'> = body;


  return await postHelper('product', postProduct, product);
}