import { postHelper } from "@/api/helpers/request";
import { postBasketItem } from "@/api/services/basketItemService";
import { BasketItem } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const basketItem: Omit<BasketItem, "id" | "date_added"> = body;
  return postHelper("basketItem", postBasketItem, basketItem);
}
