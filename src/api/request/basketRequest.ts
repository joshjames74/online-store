import axios from "axios";
import {
  Basket,
  BasketItemWithProductAndCurrency,
} from "../services/basketItemService";
import { BasketItem } from "@prisma/client";

// GET methods

export async function getBasketItemsByUserId(
  id: number,
  cache?: RequestCache,
): Promise<BasketItemWithProductAndCurrency[]> {
  const response = await fetch(`/api/user/${id}/basket`, {
    method: "GET",
    cache: cache ? cache : "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error fetching basket items");
  }
  return response.json();
}

export async function getBasketByUserId(
  id: number,
  cache?: RequestCache,
): Promise<Basket> {
  const response = await fetch(`/api/user/${id}/basket`, {
    method: "GET",
    cache: cache ? cache : "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error fetching basket");
  }
  return response.json();
}

// PUT methods

export async function putBasketItemQuantityById(
  id: number,
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

export async function deleteBasketItemById(id: number): Promise<void> {
  const response = await axios(`/api/basketItem/${id}`, { method: "DELETE" });
  return response.data;
}

export async function deleteBasketById(id: number): Promise<void> {
  const response = await fetch(`/api/user/${id}/basket`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting basket");
  }
  return response.json();
}
