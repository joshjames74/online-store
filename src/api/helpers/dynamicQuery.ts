import { Args, Select } from "@prisma/client/runtime/library";
import prisma from "../../lib/prisma";
import { QueryTransformer } from "../transformers";
import { FieldValuePair } from "./request";
import { ModelType, ModelMap, TableMap, IncludeMap, ResultType } from "./types";
import { Prisma, PrismaClient } from "@prisma/client";


// GET methods

export async function getOneEntityByField<T extends keyof TableMap>(
    modelName: T, 
    field: TableMap[T], 
    value: any,
    include?: IncludeMap[T]): Promise<ResultType<T, IncludeMap[T]> | void> {
    if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {

        var query = {}

        Object.assign(query, { where: { [field]: value }})
        if (include) { Object.assign(query, { include: include }); };

        return await (prisma[modelName] as any).findFirst(query);
    } 
    return
}

export async function getEntitiesByField<T extends keyof TableMap>(
    modelName: T, 
    field: TableMap[T], 
    value: any, 
    include?: IncludeMap[T]): Promise<T[] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {

        var query = {};

        Object.assign(query, { where: { [field]: value }});
        if (include) { Object.assign(query, { include: include })};
        return await (prisma[modelName] as any).findMany(query);
    }
    return
}

// to do: remove ModelName
export async function getAllEntity<T extends keyof TableMap>(modelName: T): Promise<ModelMap[T][] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        return await (prisma[modelName] as any).findMany({ where: {  } })
    }
    return
}

export async function getEntitiesByFields<T extends keyof TableMap>(
    modelName: T, 
    whereQuery: any,
    orderQuery?: any,
    skip?: number,
    take?: number,
): Promise<ModelMap[T][] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {

        var query = {}
        
        Object.assign(query, { where: whereQuery });
        if (orderQuery) { Object.assign(query, { orderBy: orderQuery }) };
        if (skip && !isNaN(skip)) { Object.assign(query, { skip: skip })};
        if (take && !isNaN(take)) { Object.assign(query, { take: take })};

        return await (prisma[modelName] as any).findMany(query);
    }
};


export async function getEntityViewByField<T extends keyof TableMap>(
    modelName: T,
    field: TableMap[T],
    param: any,
    viewField: any,
): Promise<any> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        return await (prisma[modelName] as any).findMany({
            where: { [field]: param},
            include: {
                [viewField]: true
            }
        })
    }
}


// TO DO: change to from ModelType to keyof TableMap

// POST methods

export async function postOneEntity<T extends ModelType>(modelName: T, entity: Partial<ModelMap[T]>): Promise<ModelMap[T] | void> {
    if (prisma[modelName]) {
        return await (prisma[modelName] as any).create({data: entity});
    }
    return
}


// DELETE methods

export async function deleteOneEntityByField<T extends ModelType>(modelName: T, field: TableMap[T], value: any): Promise<ModelMap[T] | void> {
    if (prisma[modelName] && typeof prisma[modelName].delete == 'function') {
        return await (prisma[modelName] as any).delete({ where: { [field]: value }});
    };
    return;
}


// PUT methods

export async function putOneEntityByField<T extends ModelType>(
    modelName: T, 
    searchData: FieldValuePair<T>,
    putData: FieldValuePair<T>[]
): Promise<ModelMap[T] | void> {
    if (prisma[modelName] && typeof prisma[modelName].update == 'function') {

        const putFormatted = putData.reduce((obj: any, item: FieldValuePair<T>) => {
            return Object.assign(obj, { [item.field]: item.value })
        }, {})

        return await (prisma[modelName] as any).update({ 
            where: { [searchData.field]: searchData.value }, 
            data: putFormatted
        })
    }
};