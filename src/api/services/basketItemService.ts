import { BasketItem } from "@prisma/client";
import { getEntitiesByField, getEntityViewByField, getOneEntityByField } from "../helpers/dynamicQuery";
import { ResultType } from "../helpers/types";


// GET functions

export function getBasketItemById(id: number): Promise<BasketItem[] | void> {
    return getOneEntityByField('basketItem', "id", id);
};

export function getBasketItemsByUserId(id: number): Promise<ResultType<'basketItem', {"product": true}> | void> {
    return getEntitiesByField('basketItem', "usrId", id, { "product": true });
}