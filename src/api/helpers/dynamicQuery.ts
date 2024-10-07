import { Address, Basket, Category, Country, Currency, Order, Product, Review, User } from "@prisma/client";
import prisma from "../../lib/prisma";
import { ModelType, ModelMap, TableMap } from "./types";


// TO DO: ERROR HANDLING

// GET methods

export async function getOneEntityByField<T extends ModelType>(
    modelName: T, 
    field: TableMap[T], 
    value: any): Promise<ModelMap[T] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
        return await (prisma[modelName] as any).findFirst({ where: { [field]: value } })
    } 
    return
}

export async function getAllEntityByField<T extends ModelType>(
    modelName: Uncapitalize<T>, 
    field: TableMap[T], 
    value: any): Promise<ModelMap[T][] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        return await (prisma[modelName] as any).findMany({ where: { [field]: value } })
    }
    return
}

export async function getAllEntity<T extends ModelType>(modelName: T): Promise<ModelMap[T][] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        return await (prisma[modelName] as any).findMany({ where: {  } })
    }
    return
}

// POST methods

export async function postOneEntity<T extends ModelType>(modelName: T, entity: Partial<ModelMap[T]>): Promise<ModelMap[T] | void> {
    if (prisma[modelName]) {
        return await (prisma[modelName] as any).create({data: entity});
    }
    return
}