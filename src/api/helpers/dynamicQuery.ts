import prisma from "../../lib/prisma";
import { FieldValuePair } from "./request";
import { ModelType, ModelMap, TableMap, IncludeMap, ResultType } from "./types";


type EntityQueryParams<T extends keyof TableMap, I extends IncludeMap[T]> = {
  modelName: T;
  field: TableMap[T];
  value: any;
  include?: I;
  orderQuery?: any;
};


/**
 * Creates a database query object based on a field, value, and optional parameters like inclusion, ordering, 
 * pagination, etc. This query can be used with Prisma or similar ORMs.
 *
 * @template T - A key of the `TableMap` type representing the target model.
 * @template I - The `IncludeMap` type for the target model, specifying the relations to include.
 *
 * @param {TableMap[T]} field - The field to filter the query by. Must be a valid key in the model.
 * @param {any} value - The value to match for the given field.
 * @param {I} [include] - Optional. Relations to include in the query, as defined in the `IncludeMap`.
 * @param {any} [orderQuery] - Optional. Specifies the order of the query results.
 * @param {number} [skip] - Optional. Number of results to skip (for pagination).
 * @param {number} [take] - Optional. Number of results to take (for pagination).
 *
 * @returns {any} - A query object compatible with Prisma.
 *
 * @example
 * // Example usage:
 * const query = createQueryFromField('productId', 42, { currency: true }, { review_score: 'DESC' }, 10, 5);
 * const results = prisma.product.findMany(query);
 */
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
  where: { [key in typeof field]: typeof value};
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
  } = { where: { [field]: value } as { [ key in typeof field]: typeof value } };

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

export async function getOneEntityByField<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(
  modelName: T,
  field: TableMap[T],
  value: any,
  include?: I,
): Promise<ResultType<T, I> | void> {
  if (prisma[modelName] && typeof prisma[modelName].findFirst == "function") {
    const query = createQueryFromField(field, value, include);
    return await (prisma[modelName] as any).findFirst(query);
  }
  return;
}

export async function getEntitiesByField<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(
  modelName: T,
  field: TableMap[T],
  value: any,
  include?: I,
  orderQuery?: any,
): Promise<ResultType<T, I>[] | void> {
  if (prisma[modelName] && typeof prisma[modelName].findMany == "function") {
    const query = createQueryFromField(field, value, include, orderQuery);
    return await (prisma[modelName] as any).findMany(query);
  }
  return;
}

export async function getAllEntity<T extends keyof TableMap>(
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

export async function getOneEntityByFields<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(
  modelName: T,
  whereQuery: any,
  orderQuery?: any,
  skip?: number,
  take?: number,
  include?: I,
): Promise<ResultType<T, I> | void> {
  if (prisma[modelName] && typeof prisma[modelName].findFirst == "function") {
    const query = {};

    Object.assign(query, { where: whereQuery });
    if (orderQuery) {
      Object.assign(query, { orderBy: orderQuery });
    }
    if (include) {
      Object.assign(query, { include });
    }
    if (skip && !isNaN(skip)) {
      Object.assign(query, { skip: skip });
    }
    if (take && !isNaN(take)) {
      Object.assign(query, { take: take });
    }

    return await (prisma[modelName] as any).findFirst(query);
  }
}

export async function getEntitiesByFields<
  T extends keyof TableMap,
  I extends IncludeMap[T],
>(
  modelName: T,
  whereQuery: any,
  orderQuery?: any,
  skip?: number,
  take?: number,
  include?: I,
): Promise<ResultType<T, I>[] | void> {
  if (prisma[modelName] && typeof prisma[modelName].findMany == "function") {
    const query = {};

    Object.assign(query, { where: whereQuery });
    if (orderQuery) {
      Object.assign(query, { orderBy: orderQuery });
    }
    if (include) {
      Object.assign(query, { include });
    }
    if (skip !== undefined && !isNaN(skip)) {
      Object.assign(query, { skip: skip });
    }
    if (take !== undefined && !isNaN(take)) {
      Object.assign(query, { take: take });
    }

    return await (prisma[modelName] as any).findMany(query);
  }
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
