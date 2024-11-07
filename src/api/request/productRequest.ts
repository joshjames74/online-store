import { QueryParams } from "@/redux/reducers/product";
import { Product } from "@prisma/client";
import axios from "axios";
import { ManyWithMetadata, ModelsResponse, ResultType } from "../helpers/types";
import { buildUrl } from "../helpers/utils";


export async function getProductById(id: number): Promise<ResultType<'product', { currency: true }>> {
    const response = await fetch(`/api/product/${id}`, {
        method: "GET",
        //cache: "force-cache"
    });
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

export async function getProductsBySearchParams(params: Partial<QueryParams>): Promise<ManyWithMetadata<'product', { currency: true }>> {
    const url = buildUrl("/api/product", params);
    const response = await fetch(url, { 
        method: "GET",
        cache: "force-cache"
     });
    if (!response.ok) {
        throw new Error('Error fetching product by search params')
    }
    return response.json();
}