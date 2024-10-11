import { Category } from "@prisma/client";
import axios from "axios";

export async function getAllCategories(): Promise<Category[]> {
    const response = await axios(`/api/category/all`, {
        method: "GET",
    });
    return response.data;
}