// POST request

import { postHelper } from "@/api/helpers/request";
import { postOrder } from "@/api/request/orderRequest";
import { BasketItem, Order } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const order: Omit<Order, "id"> = body;
  const basketItems: BasketItem[] = body;

  return await postHelper("order", postOrder, {
    order: order,
    basketItems: basketItems,
  });
}
