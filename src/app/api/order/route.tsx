import { postHelper } from "@/api/helpers/request";
import { postOrder } from "@/api/services/orderService";
import { BasketItem, Order } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


// POST request

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const data: { order: Omit<Order, "id"> } = body;
  return await postHelper("order", postOrder, data);
}
