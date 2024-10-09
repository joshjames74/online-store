import { Product } from "@prisma/client";


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