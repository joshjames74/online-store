import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma";
import { FieldValuePair } from "./request";
import {
  ModelType,
  ModelMap,
  TableMap,
  IncludeMap,
  ResultType,
  PrismaMap,
} from "./types.js";
import { DefaultArgs } from "@prisma/client/runtime/library";

type EntityQueryParams<T extends keyof TableMap, I extends IncludeMap[T]> = {
  modelName: T;
  field: TableMap[T];
  value: any;
  include?: I;
  orderQuery?: any;
};

function createQueryFromField<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(
  field: TableMap[T],
  value: any,
  include?: I,
  orderQuery?: any,
  skip?: number,
  take?: number,
): {
  where: { [key in typeof field]: typeof value };
  include?: I;
  orderBy?: typeof orderQuery;
  skip?: number;
  take?: number;
} {
  // Create where object with explicit typing
  const query: {
    where: { [key in typeof field]: typeof value };
    include?: I;
    orderBy?: typeof orderQuery;
    skip?: number;
    take?: number;
  } = { where: { [field]: value } as { [key in typeof field]: typeof value } };

  if (include) {
    Object.assign(query, { include: include });
  }
  if (orderQuery) {
    Object.assign(query, { orderBy: orderQuery });
  }
  if (skip && !isNaN(skip)) {
    Object.assign(query, { skip: skip });
  }
  if (take && !isNaN(take)) {
    Object.assign(query, { take: take });
  }
  return query;
}

export type GetArgs<T extends keyof TableMap, I extends IncludeMap[T]> = {
  modelName: T;
  whereQuery: any;
  orderQuery?: any;
  skip?: number;
  take?: number;
  include?: I;
};

// split into different file?
function buildQuery<T extends keyof TableMap, I extends IncludeMap[T]>(
  args: GetArgs<T, I>,
) {
  const { whereQuery, orderQuery, skip, take, include } = args;

  const query = {};
  Object.assign(query, { where: whereQuery });
  // if (whereQuery) {
  //   Object.assign(query, { where: whereQuery });
  // };
  if (include) {
    Object.assign(query, { include: include });
  }
  if (orderQuery) {
    Object.assign(query, { orderBy: orderQuery });
  }
  if (skip && !isNaN(skip)) {
    Object.assign(query, { skip: skip });
  }
  if (take && !isNaN(take)) {
    Object.assign(query, { take: take });
  }
  return query;
}

// GET methods

export async function getOneEntityByFields<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(args: GetArgs<T, I>): Promise<ResultType<T, I> | void> {
  const { modelName } = args;
  if (prisma[modelName] && typeof prisma[modelName].findFirst == "function") {
    const query = buildQuery<T, I>(args);
    return await (prisma[modelName] as any).findFirst(query);
  }
}

export async function getEntitiesByFields<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(args: GetArgs<T, I>): Promise<ResultType<T, I>[] | void> {
  const { modelName } = args;
  if (prisma[modelName] && typeof prisma[modelName].findMany == "function") {
    const query = buildQuery<T, I>(args);
    return await (prisma[modelName] as any).findMany(query);
  }
}

export async function getAllEntities<T extends keyof TableMap>(
  modelName: T,
  orderQuery?: any,
): Promise<ModelMap[T][] | void> {
  if (prisma[modelName] && typeof prisma[modelName].findMany == "function") {
    const query = { where: {} };
    if (orderQuery) {
      Object.assign(query, { orderBy: orderQuery });
    }
    return await (prisma[modelName] as any).findMany(query);
  }
  return;
}

// Metadata methods

export async function getCountByField<T extends keyof ModelMap>(
  modelName: T,
  field: TableMap[T],
  value: any,
  actionField?: TableMap[T],
): Promise<any | void> {
  if (prisma[modelName] && typeof prisma[modelName].count == "function") {
    const query = createQueryFromField(field, value);
    return await (prisma[modelName] as any).count(query);
  }
}

export async function getSumByField<T extends keyof ModelMap>(
  modelName: T,
  field: TableMap[T],
  value: any,
  actionField?: TableMap[T],
): Promise<any | void> {
  if (prisma[modelName] && typeof prisma[modelName].aggregate == "function") {
    const query = createQueryFromField(field, value);
    if (actionField) {
      Object.assign(query, { _sum: { [actionField]: true } });
    }
    return await (prisma[modelName] as any).aggregate(query);
  }
}

// TO DO: change to from ModelType to keyof TableMap
// POST methods

export async function postOneEntity<
  T extends ModelType,
  I extends IncludeMap[T],
>(modelName: T, entity: Partial<ModelMap[T]>): Promise<ModelMap[T] | void> {
  if (prisma[modelName]) {
    return await (prisma[modelName] as any).create({ data: entity });
  }
  return;
}

// DELETE methods

export async function deleteOneEntityByField<T extends ModelType>(
  modelName: T,
  field: TableMap[T],
  value: any,
): Promise<ModelMap[T] | void> {
  if (prisma[modelName] && typeof prisma[modelName].delete == "function") {
    return await (prisma[modelName] as any).delete({
      where: { [field]: value },
    });
  }
  return;
}

export async function deleteEntitiesByField<T extends ModelType>(
  modelName: T,
  field: TableMap[T],
  value: any,
): Promise<ModelMap[T][] | void> {
  if (prisma[modelName] && typeof prisma[modelName].deleteMany == "function") {
    return await (prisma[modelName] as any).deleteMany({
      where: { [field]: value },
    });
  }
}

// PUT methods

export async function putOneEntityByField<T extends ModelType>(
  modelName: T,
  searchData: FieldValuePair<T>,
  putData: FieldValuePair<T>[],
): Promise<ModelMap[T] | void> {
  if (prisma[modelName] && typeof prisma[modelName].update == "function") {
    const putFormatted = putData.reduce((obj: any, item: FieldValuePair<T>) => {
      return Object.assign(obj, { [item.field]: item.value });
    }, {});

    return await (prisma[modelName] as any).update({
      where: { [searchData.field]: searchData.value },
      data: putFormatted,
    });
  }
}

export async function upsertOneEntityByField<T extends ModelType>(
  modelName: T,
  whereQuery: any,
  updateQuery: any,
  createQuery: any,
): Promise<ModelMap[T] | void> {
  if (prisma[modelName] && typeof prisma[modelName].upsert == "function") {
    const query = {};

    Object.assign(query, { where: whereQuery });
    Object.assign(query, { update: updateQuery });
    Object.assign(query, { create: createQuery });

    return await (prisma[modelName] as any).upsert(query);
  }
}
