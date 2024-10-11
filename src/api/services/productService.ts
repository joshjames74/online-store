import { Product } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByFields, getOneEntityByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { QueryParams } from "@/redux/reducers/product";
import { transformQueryToPrismaQuery } from "../transformers";
import { productSearchTransformer } from "../transformers/productSearchTransformer";


// GET methods

export async function getProductById(id: number): Promise<Product | void> {
    return getOneEntityByField('product', 'id', id);
}

export async function getProductByUserId(id: number): Promise<Product | void> {
    return getOneEntityByField('product', 'sellerId', id);
}

export async function getAllProducts(): Promise<Product[] | void> {
    return getAllEntity('product');
}

export async function getProductBySearch(params: QueryParams): Promise<Product[] | void> {
    const prismaQuery = transformQueryToPrismaQuery(params, productSearchTransformer);
    const products = await getEntitiesByFields('product', prismaQuery);
    return products
}


// POST methods

export async function postProduct(product: Omit<Product, 'product_id'>): Promise<Product | void> {
    return postOneEntity('product', product);
};


// DELETE methods

export async function deleteProductById(id: number): Promise<Product | void> {
    return deleteOneEntityByField('product', 'id', id);
};


// PUT methods

export async function putProductByFields(searchFields: FieldValuePair<'product'>, putFields: FieldValuePair<'product'>[]): Promise<Product | void> {
    return await putOneEntityByField('product', searchFields, putFields);
}