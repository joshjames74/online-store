import axios from "axios";
import { Basket, BasketItemWithProduct } from "../services/basketItemService";
import { BasketItem } from "@prisma/client";

export async function getBasketItemsByUserId(id: number): Promise<BasketItemWithProduct[]> {
    const response = await axios(`/api/user/${id}/basket`, { method: "GET" });
    return response.data;
}

export async function getBasketByUserId(id: number): Promise<Basket> {
    const response = await axios(`/api/user/${id}/basket`, { method: "GET" });
    return response.data;
}


// PUT methods

export async function putBasketItemQuantityById(id: number, quantity: number): Promise<BasketItem> {
    const response = await axios(`/api/basket/${id}`, {
        method: "PUT",
        data: {
            quantity: quantity
        }
    });
    return response.data;
}



// POST methods

export async function postBasketItem(basketItem: Omit<BasketItem, 'id' | 'date_added'>): Promise<BasketItem> {
    const response = await axios(`/api/basketItem`, {
        method: "POST",
        data: basketItem
    });
    return response.data;
}


// DELETE methods

export async function deleteBasketItemById(id: number): Promise<void> {
    const response = await axios(`/api/basketItem/${id}`, { method: "DELETE" });
    return response.data;
}