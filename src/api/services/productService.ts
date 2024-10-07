import { Product } from "@prisma/client";
import { getAllEntity, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";


// GET methods

export async function getProductById(id: number): Promise<Product | void> {
    return getOneEntityByField('product', 'id', id);
}

export async function getAllProducts(): Promise<Product[] | void> {
    return getAllEntity('product');
}


// POST methods

export async function postProduct(product: Omit<Product, 'product_id'>): Promise<Product | void> {
    return postOneEntity('product', product);
}