import { Prisma, Product } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByFields, getOneEntityByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { queryParamsToPrismaQuery } from "../transformers";
import { ProductParams, productQueryTransformer } from "../transformers/productSearchTransformer";
import { ManyWithMetadata, Metadata, ModelsResponse, ResultType } from "../helpers/types";
import { convertPrice } from "../helpers/utils";

// GET methods

export async function getProductById(id: number): Promise<ResultType<'product', { currency: true }> | void> {
    return getOneEntityByField('product', 'id', id, { currency: true });
};

export async function getProductByUserId(id: number): Promise<Product | void> {
    return getOneEntityByField('product', 'sellerId', id);
};

export async function getAllProducts(): Promise<Product[] | void> {
    return getAllEntity('product');
};

export async function getProductBySearch(params: Partial<ProductParams>): Promise<ManyWithMetadata<'product', { currency: true }> | void> {

    const { whereQuery, orderQuery, skip, take } = queryParamsToPrismaQuery(params, productQueryTransformer);
    const products = await getEntitiesByFields('product', whereQuery, orderQuery, skip, take, { currency: true });

    // get metadata
    const count = products?.length;
    const max_price = Math.max(...products?.length ? products?.map(product => product.price * product.currency.gbp_exchange_rate) : [])

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