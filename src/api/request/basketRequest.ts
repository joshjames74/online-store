import { BasketItem } from "@prisma/client";
import axios from "axios";

export async function getBasketItemsByUserId(id: number): Promise<BasketItem[]> {
    const response = await axios(`/api/user/${id}/basket`, { method: "GET" });
    return response.data;
}