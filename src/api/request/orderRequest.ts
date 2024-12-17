import { OrderParams } from "../transformers/orderSearchTransformer";
import { buildUrl } from "../helpers/utils";
import { Order } from "@prisma/client";
import { fetchData } from ".";
import { OrderWithMetadata } from "../services/orderService";

// GET methods

export async function getOrderViewById(id: string): Promise<any> {
  const url = `/api/order/${id}`;
  return await fetchData(url);
}

// rename to order view?
export async function getOrdersByUserId({
  id,
  params,
  cache,
}: {
  id: string;
  params: Omit<Partial<OrderParams>, "usrId">;
  cache?: RequestCache;
}): Promise<OrderWithMetadata[]> {
  const url = buildUrl(`/api/user/${id}/orders`, params);
  return await fetchData(url, "no-cache");
}

// POST methods

export async function postOrder(data: {
  order: Omit<Order, "id">;
}): Promise<Order> {
  const url = "/api/order";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error posting order");
  }
  return response.json();
}
