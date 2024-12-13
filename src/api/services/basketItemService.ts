import { BasketItem, Currency } from "@prisma/client";
import {
  deleteEntitiesByField,
  deleteOneEntityByField,
  getCountByField,
  getEntitiesByFields,
  getOneEntityByFields,
  postOneEntity,
  putOneEntityByField,
} from "../helpers/dynamicQuery";
import { Metadata, ResultType } from "../helpers/types.js";
import { OrderRelation, SearchFieldType } from "../transformers";
import { FieldValuePair } from "../helpers/request";
import { convertPrice } from "../helpers/utils";

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
): Promise<BasketItemWithProduct | void> {
  return getOneEntityByFields({
    modelName: "basketItem",
    whereQuery: { id: id },
    include: { product: true },
  });
}

export async function getBasketItemsByUserId(
  id: number,
): Promise<BasketItemWithProduct[] | void> {
  return getEntitiesByFields({
    modelName: "basketItem",
    whereQuery: { usrId: id },
    include: { product: true },
  });
}

export async function getBasketItemByUserIdAndProductId(
  userId: number,
  productId: number,
): Promise<BasketItem | void> {
  return await getOneEntityByFields({
    modelName: "basketItem",
    whereQuery: { productId: productId, usrId: userId },
  });
}

export async function getBasketByUserId(id: number): Promise<Basket | void> {
  const basket: Basket = {
    items: [],
    metadata: { count: NaN, total: { quantity: NaN, price: NaN } },
  };

  // get items by user id
  let items;
  try {
    items = await getEntitiesByFields({
      modelName: "basketItem",
      whereQuery: { usrId: id },
      orderQuery: { id: OrderRelation.ASC },
      include: { product: true },
    });

    if (!items) {
      return;
    }
    basket.items = items;
  } catch (error) {
    console.error(error);
    return;
  }

  // count items
  try {
    const count = await getCountByField("basketItem", "usrId", id);
    basket.metadata.count = count ? count : NaN;
  } catch (error) {
    console.error(error);
  }

  // count quantities
  const total_items = items.reduce((prev, curr) => prev + curr.quantity, 0);
  basket.metadata.total.quantity = total_items;

  // sum price (in gbp)
  const total_price = items.reduce(
    (prev, curr) => prev + convertPrice(curr.product.price * curr.quantity, 1),
    0,
  );
  basket.metadata.total.price = Math.round(total_price * 100) / 100;

  return basket;
}

// DELETE functions

export async function deleteBasketItemById(id: number): Promise<BasketItem | void> {
  return await deleteOneEntityByField("basketItem", "id", id);
}

export async function deleteAllBasketItemByUserId(id: number): Promise<BasketItem[] | void> {
  return await deleteEntitiesByField("basketItem", "usrId", id);
}

// PUT functions

export async function putBasketItemByFields({ params }: { params: {
  searchField: FieldValuePair<"basketItem">,
  putFields: FieldValuePair<"basketItem">[],
}}): Promise<BasketItem | void> {
  const { searchField, putFields } = params;
  return await putOneEntityByField("basketItem", searchField, putFields);
}

// POST functions

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
    return postOneEntity("basketItem", basketItem);
  }

  const searchField: FieldValuePair<"basketItem"> = { field: "id", value: response.id }
  const putFields: FieldValuePair<"basketItem">[] = [{ field: "quantity", value: basketItem.quantity + response.quantity }];
  const params = { searchField, putFields };
  // if does exist, increment quantity
  return putBasketItemByFields({ params: params });
}
