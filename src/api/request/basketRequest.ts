import axios from "axios";
import { Basket, BasketItemWithProduct } from "../services/basketItemService";
import { BasketItem } from "@prisma/client";
import { fetchData } from ".";

// GET methods

export async function getBasketItemsByUserId(
  id: string,
  cache?: RequestCache,
): Promise<BasketItemWithProduct[]> {
  return fetchData<BasketItemWithProduct[]>(`/api/user/${id}/basket`, cache);
}

export async function getBasketByUserId(
  id: string,
): Promise<Basket> {
  return fetchData<Basket>(`/api/user/${id}/basket`, "no-cache");
}

// PUT methods

export async function putBasketItemQuantityById(
  id: string,
  quantity: number,
): Promise<BasketItem> {
  const response = await axios(`/api/basket/${id}`, {
    method: "PUT",
    data: {
      quantity: quantity,
    },
  });
  return response.data;
}

// POST methods

export async function postBasketItem(
  basketItem: Omit<BasketItem, "id" | "date_added">,
): Promise<BasketItem> {
  const response = await axios(`/api/basketItem`, {
    method: "POST",
    data: basketItem,
  });
  return response.data;
}

// DELETE methods

export async function deleteBasketItemById(id: string): Promise<void> {
  const response = await fetch(`/api/basketItem/${id}`, { method: "DELETE" });
  if (!response) {
    throw new Error("Error deleting basket item");
  };
  return response.json();
}

// to do: rename to user id;
export async function deleteBasketById(id: string): Promise<void> {
  const response = await fetch(`/api/user/${id}/basket`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting basket");
  }
  return response.json();
}
