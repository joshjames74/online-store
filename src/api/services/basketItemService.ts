import { BasketItem } from "@prisma/client";
import { deleteOneEntityByField, getCountByField, getEntitiesByField, getOneEntityByField, getSumByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { Metadata, ResultType } from "../helpers/types";
import { OrderRelation, SearchFieldType } from "../transformers";
import { FieldValuePair } from "../helpers/request";


export type BasketItemWithProduct = ResultType<'basketItem', 'product'>
export type Basket = {
    items: BasketItemWithProduct[],
    metadata: {
        count: number,
        total: {
            quantity: number,
            price: number
        },
    }
}

// GET functions

export function getBasketItemById(id: number): Promise<BasketItemWithProduct[] | void> {
    return getOneEntityByField('basketItem', "id", id);
};

export function getBasketItemsByUserId(id: number): Promise<BasketItemWithProduct[] | void> {
    return getEntitiesByField('basketItem', "usrId", id, "product");
}

export async function getBasketByUserId(id: number): Promise<Basket | void> {

    let basket: Basket = { items: [], metadata: { count: NaN, total: { quantity: NaN, price: NaN }}}

    const items = await getEntitiesByField('basketItem', 'usrId', id, "product", { 'id': OrderRelation.ASC });
    if (!items) { return }
    basket.items = items;

    const count = await getCountByField('basketItem', 'usrId', id);
    basket.metadata.count = count ? count : NaN;

    const total_items = items.reduce((prev, curr) => (prev + curr.quantity), 0);
    basket.metadata.total.quantity = total_items;

    const total_price = items.reduce((prev, curr) => (prev + curr.product.price * curr.quantity), 0);
    basket.metadata.total.price = Math.round(total_price * 100) / 100;

    return basket;
}


// DELETE functions

export async function deleteBasketItemById(id: number): Promise<void> {
    return await deleteOneEntityByField('basketItem', 'id', id);

}


// PUT functions

export async function putBasketItemByFields(searchField: FieldValuePair<'basketItem'>, putFields: FieldValuePair<'basketItem'>[]): Promise<BasketItem | void> {
    return await putOneEntityByField('basketItem', searchField, putFields);
}


// POST functions

export async function postBasketItem(basketItem: Omit<BasketItem, 'id'| 'date_added'>): Promise<BasketItem | void> {
    return await postOneEntity('basketItem', basketItem);
}