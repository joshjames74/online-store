import prisma from "../../lib/prisma";
import { FieldValuePair } from "./request";
import { ModelType, ModelMap, TableMap, IncludeMap, ResultType } from "./types";


function createQueryFromField<T extends keyof TableMap, I extends keyof IncludeMap[T]>(
    field: TableMap[T],
    value: any,
    include?: I,
    orderQuery?: any): Object {
    var query = { where: { [field]: value } };
    if (include) { Object.assign(query, { include: { [include]: true } }) };
    if (orderQuery) { Object.assign(query, { orderBy: orderQuery })};
    return query
}


export interface GetOneByField {
    <T extends keyof TableMap, I extends keyof IncludeMap[T]>(modelName: T, field: TableMap[T], value: any, include?: I)
        : Promise<ResultType<T, I> | void>
}

export interface GetSeveralByField {
    <T extends keyof TableMap, I extends keyof IncludeMap[T]>(modelName: T, field: TableMap[T], value: any, include?: I, orderQuery?: any)
        : Promise<ResultType<T, I>[] | void>
}

export interface GetMetadata {
    <T extends keyof TableMap>(modelName: T, field: TableMap[T], value: any, actionField?: TableMap[T])
        : Promise<any | void>
}



// GET methods

export const getOneEntityByField: GetOneByField = async (modelName, field, value, include?) => {
    if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
        const query = createQueryFromField(field, value, include);
        return await (prisma[modelName] as any).findFirst(query);
    }
    return
}


export const getEntitiesByField: GetSeveralByField = async (modelName, field, value, include?, orderQuery?) => {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        const query = createQueryFromField(field, value, include, orderQuery);
        return await (prisma[modelName] as any).findMany(query);
    }
    return
}

// to do: remove ModelName
export async function getAllEntity<T extends keyof TableMap>(modelName: T): Promise<ModelMap[T][] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {
        return await (prisma[modelName] as any).findMany({ where: {} })
    }
    return
}


// to do: update with include
export async function getEntitiesByFields<T extends keyof TableMap, I extends IncludeMap[T]>(
    modelName: T,
    whereQuery: any,
    orderQuery?: any,
    skip?: number,
    take?: number,
    include?: I
): Promise<ResultType<T, I>[] | void> {
    if (prisma[modelName] && typeof prisma[modelName].findMany == 'function') {

        var query = {}

        Object.assign(query, { where: whereQuery });
        if (orderQuery) { Object.assign(query, { orderBy: orderQuery }) };
        if (include) { Object.assign(query, { include })}
        if (skip && !isNaN(skip)) { Object.assign(query, { skip: skip }) };
        if (take && !isNaN(take)) { Object.assign(query, { take: take }) };

        return await (prisma[modelName] as any).findMany(query);
    }
};


// Metadata methods

export const getCountByField: GetMetadata = async (modelName, field, value) => {
    if (prisma[modelName] && typeof prisma[modelName].count == 'function') {
        const query = createQueryFromField(field, value);
        return await (prisma[modelName] as any).count(query);
    }
}

export const getSumByField: GetMetadata = async (modelName, field, value, actionField) => {
    if (prisma[modelName] && typeof prisma[modelName].aggregate == "function") {
        var query = createQueryFromField(field, value);
        Object.assign(query, { _sum: { [actionField]: true }});
        return await (prisma[modelName] as any).aggregate(query);
    }
}


// TO DO: change to from ModelType to keyof TableMap
// POST methods

export async function postOneEntity<T extends ModelType>(modelName: T, entity: Partial<ModelMap[T]>): Promise<ModelMap[T] | void> {
    if (prisma[modelName]) {
        return await (prisma[modelName] as any).create({ data: entity });
    }
    return
}


// DELETE methods

export async function deleteOneEntityByField<T extends ModelType>(modelName: T, field: TableMap[T], value: any): Promise<ModelMap[T] | void> {
    if (prisma[modelName] && typeof prisma[modelName].delete == 'function') {
        return await (prisma[modelName] as any).delete({ where: { [field]: value } });
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

export interface GetOneByField {
    <T extends keyof TableMap, I extends keyof IncludeMap[T]>(modelName: T, field: TableMap[T], value: any, include?: I)
        : Promise<ResultType<T, I> | void>
}

export async function upsertOneEntityByField<T extends ModelType>(
    modelName: T,
    whereQuery: any,
    updateQuery: any,
    createQuery: any
): Promise<ModelMap[T] | void> {
    
    if (prisma[modelName] && typeof prisma[modelName].upsert == 'function') {

        var query = {}

        Object.assign(query, { where: whereQuery });
        Object.assign(query, { update: updateQuery });
        Object.assign(query, { create: createQuery });

        return await (prisma[modelName] as any).upsert(query);

    }
}