import { Product } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByFields, getOneEntityByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { QueryParams } from "@/redux/reducers/product";
import { queryParamsToPrismaQuery, transformQueryToPrismaQuery } from "../transformers";
import { ProductParams, productQueryTransformer, productSearchTransformer } from "../transformers/productSearchTransformer";
import { Metadata, ModelsResponse } from "../helpers/types";

import { TableMap } from "../helpers/types";


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

export async function getProductBySearch(params: Partial<ProductParams>): Promise<ModelsResponse<'product'> | void> {

    const { whereQuery, orderQuery } = queryParamsToPrismaQuery(params, productQueryTransformer);
    const products = await getEntitiesByFields('product', whereQuery, orderQuery)

    // get metadata
    const count = products?.length;
    const max_price = Math.max(...products?.length ? products?.map(product => product.price) : [])

    const metadata: Metadata<'product'> = {
        count: count,
        "price": { max: max_price, min: 0 }
    }

    const response: ModelsResponse<'product'> = { data: products, metadata: metadata };

    return response
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