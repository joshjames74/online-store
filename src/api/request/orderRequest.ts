import axios from "axios";
import { OrderParams } from "../transformers/orderSearchTransformer";
import { buildUrl } from "../helpers/utils";
import { BasketItem, Order } from "@prisma/client";
import { url } from "inspector";

// GET methods

export async function getOrderViewById(id: number): Promise<any> {
  const response = await axios(`/api/order/${id}`, { method: "GET" });
  return response;
}

export async function getOrdersByUserId({
  id,
  params,
}: {
  id: number;
  params: Omit<OrderParams, "usrId">;
}): Promise<any> {
  const url = buildUrl(`/api/user/${id}/orders`, params);
  const response = await fetch(url, {
    method: "GET",
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error in fetching order views by search");
  }
  return response.json();
}

// POST methods

// export async function postOrder({
//   order,
//   basketItems,
// }: {
//   order: Omit<Order, "id">;
//   basketItems: BasketItem[];
// }): Promise<Order> {
//   const url = "/api/order";
//   const response = await fetch(url, {
//     method: "POST",
//     body: {
//       order: JSON.stringify(order),
//       basketItems: JSON.stringify(basketItems),
//     },
//   });
//   if (!response.ok) {
//     throw new Error("Error posting order");
//   }
//   return response.json();
// }


export async function postOrder(data: { order: Omit<Order, "id">, basketItems: BasketItem[], }): Promise<Order> {
  const url = "/api/order";
  console.log(JSON.stringify(data))
  
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error("Error posting order");
  }
  return response.json();
}
