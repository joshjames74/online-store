import { BasketItem } from "@prisma/client";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

export type BasketItemWithProduct = ResultType<"basketItem", { product: true }>;
export type Basket = {
  items: BasketItemWithProduct[];
  metadata: {
    count: number;
    total: {
      quantity: number;
      price: number;
    };
  };
};

// GET functions

export async function getBasketItemById(
  id: number,
): Promise<BasketItemWithProduct | null> {
  return await prisma.basketItem.findFirst({
    where: { id: id },
    include: { product: true },
  });
}

export async function getBasketItemsByUserId(
  id: string,
): Promise<BasketItemWithProduct[] | void> {
  return await prisma.basketItem.findMany({
    where: { usrId: id },
    include: { product: true },
  });
}

export async function getBasketItemByUserIdAndProductId(
  userId: string,
  productId: number,
): Promise<BasketItem | null> {
  return await prisma.basketItem.findFirst({
    where: { productId: productId, usrId: userId },
  });
}

export async function getBasketByUserId(id: string): Promise<Basket | void> {
  const items = await prisma.basketItem.findMany({
    where: { usrId: id },
    include: { product: true },
    orderBy: { id: "asc" },
  });
  const metadata = await prisma.basketItem.aggregate({
    where: { usrId: id },
    _count: { usrId: true },
    _sum: { quantity: true },
  });
  const totalPrice = items.reduce(
    (prev, curr) => prev + curr.quantity * curr.product.price,
    0,
  );
  return {
    items: items,
    metadata: {
      count: metadata._count.usrId || 0,
      total: {
        quantity: metadata._sum.quantity || 0,
        price: totalPrice,
      },
    },
  };
}

// DELETE functions

export async function deleteBasketItemById(
  id: number,
): Promise<BasketItem | void> {
  return await prisma.basketItem.delete({
    where: { id: id },
  });
}

export async function deleteAllBasketItemByUserId(
  id: string,
): Promise<any | void> {
  return await prisma.basketItem.deleteMany({
    where: { usrId: id },
  });
}

// PUT functions

export async function putBasketItemByQuantity({
  params,
}: {
  params: { id: number; quantity: number };
}): Promise<BasketItem | void> {
  return await prisma.basketItem.update({
    where: { id: params.id },
    data: { quantity: params.quantity },
  });
}

// POST functions

// to do: use a transaction
export async function postBasketItem(
  basketItem: Omit<BasketItem, "id" | "date_added">,
): Promise<BasketItem | void> {
  // check if product with this id already in basket
  const response = await getBasketItemByUserIdAndProductId(
    basketItem.usrId,
    basketItem.productId,
  );

  // if does not exist, post item
  if (!response) {
    return await prisma.basketItem.create({
      data: basketItem,
    });
  }

  // const searchField: FieldValuePair<"basketItem"> = {
  //   field: "id",
  //   value: response.id,
  // };
  // const putFields: FieldValuePair<"basketItem">[] = [
  //   { field: "quantity", value: basketItem.quantity + response.quantity },
  // ];
  // const params = { searchField, putFields };
  // if does exist, increment quantity
  return putBasketItemByQuantity({
    params: {
      id: response.id,
      quantity: basketItem.quantity + response.quantity,
    },
  });
}
