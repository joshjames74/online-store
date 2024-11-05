import { BasketItem, Currency } from "@prisma/client";
import { deleteOneEntityByField, getCountByField, getEntitiesByField, getEntitiesByFields, getOneEntityByField, getOneEntityByFields, getSumByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { Metadata, ResultType } from "../helpers/types";
import { OrderRelation, SearchFieldType } from "../transformers";
import { FieldValuePair } from "../helpers/request";
import { convertPrice } from "../helpers/utils";


export type BasketItemWithProductAndCurrency = ResultType<'basketItem', { product: { include: { currency: true }} }>
export type Basket = {
    items: BasketItemWithProductAndCurrency[],
    metadata: {
        count: number,
        total: {
            quantity: number,
            price: number
        },
    }
}

// GET functions

export async function getBasketItemById(id: number): Promise<BasketItemWithProductAndCurrency[] | void> {
    return getOneEntityByField('basketItem', "id", id);
};

export async function getBasketItemsByUserId(id: number): Promise<BasketItemWithProductAndCurrency[] | void> {
    return getEntitiesByField('basketItem', "usrId", id, { product: true });
}

export async function getBasketItemByUserIdAndProductId(userId: number, productId: number): Promise<BasketItem | void> {
    return await getOneEntityByFields('basketItem', { productId: productId, usrId: userId });
} 

export async function getBasketByUserId(id: number): Promise<Basket | void> {
    let basket: Basket = { items: [], metadata: { count: NaN, total: { quantity: NaN, price: NaN }}}

    // get items by user id
    let items;
    try { 
        items = await getEntitiesByField('basketItem', 'usrId', id, { product: { include: { currency: true }} }, { 'id': OrderRelation.ASC });
        if (!items) { return }
        basket.items = items;
    } catch (error) { console.error(error); return }

    // count items
    try {
        const count = await getCountByField('basketItem', 'usrId', id);
        basket.metadata.count = count ? count : NaN;
    } catch (error) { console.error(error) };

    // count quantities
    const total_items = items.reduce((prev, curr) => (prev + curr.quantity), 0);
    basket.metadata.total.quantity = total_items;

    // sum price (in gbp)
    const total_price = items.reduce((prev, curr) => (prev + convertPrice(curr.product.price * curr.quantity, curr.product.currency.gbp_exchange_rate)), 0);
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

    // check if product with this id already in basket
    const response = await getBasketItemByUserIdAndProductId(basketItem.usrId, basketItem.productId);

    // if does not exist, post item
    if (!response) {
        return postOneEntity('basketItem', basketItem);
    }

    // if does exist, increment quantity
    return putBasketItemByFields({ field: 'id', value: response.id}, [{ field: 'quantity', value: basketItem.quantity + response.quantity}])
}