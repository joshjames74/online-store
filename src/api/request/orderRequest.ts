import axios from "axios";
import { OrderParams } from "../transformers/orderSearchTransformer";
import { buildUrl } from "../helpers/utils";

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
