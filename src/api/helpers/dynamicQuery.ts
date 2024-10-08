import prisma from "../../lib/prisma";
import { FieldValuePair } from "./request";
import { ModelType, ModelMap, TableMap } from "./types";


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

export async function getEntitiesByField<T extends ModelType>(
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