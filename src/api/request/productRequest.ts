import { QueryParams } from "@/redux/reducers/product";
import { Product } from "@prisma/client";
import axios from "axios";
import { ModelsResponse } from "../helpers/types";


export async function getProductById(id: number): Promise<Product> {
    const response = await fetch(`/api/product/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}


export async function getAllProducts(): Promise<Product[]> {
    const response = await fetch(`/api/product/all`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}

export async function getProductsBySearchParams(params: Partial<QueryParams>): Promise<ModelsResponse<'product'>> {
    const response = await axios(`/api/product`, {
        method: "GET",
        params: {...params}
    });
    return response.data;
}