import { QueryParams } from "@/redux/reducers/product";
import { ModelType, TableMap } from "../helpers/types.js";
import {
  ProductParams,
  ProductQueryTransformer,
} from "./productSearchTransformer";
import {
  ReviewParams,
  ReviewQueryTransformer,
} from "./reviewSearchTransformer";
import { OrderParams, OrderQueryTransformer } from "./orderSearchTransformer";

export type QueryTransformer = ProductQueryTransformer;

export type TransformerMap = {
  address: null;
  basket: null;
  basketItem: null;
  category: null;
  country: null;
  currency: null;
  order: null;
  orderItem: OrderQueryTransformer;
  product: ProductQueryTransformer;
  review: ReviewQueryTransformer;
  usr: null;
};

export type ParamMap = {
  address: null;
  basket: null;
  basketItem: null;
  category: null;
  country: null;
  currency: null;
  order: null;
  orderItem: OrderParams;
  product: ProductParams;
  review: ReviewParams;
  usr: null;
};

// define relations

export enum WhereRelation {
  CONTAINS = "contains",
  LESS_THAN = "lt",
  LESS_THAN_OR_EQUAL = "lte",
  GREATER_THAN = "gt",
  GREATHER_THAN_OR_EQUAL = "gte",
  EQUALS = "equals",
  NOT = "not",
  SOME = "some",
  ID = "categoryId",
  IN = "in",
}

export enum OrderRelation {
  ASC = "asc",
  DESC = "desc",
}

export type Relation = WhereRelation | OrderRelation;

// // delete
// export enum PrismaRelation (WhereRelation & OrderRelation)

// delete
export type SearchFieldType<T extends ModelType> = {
  data: any;
  targets: TableMap[T][];
  relation: Relation[];
};

// define fields

export type OrderField<T extends ModelType> = {
  targets: TableMap[T][];
  relation: OrderRelation;
};

export type WhereField<T extends ModelType> = {
  relation: WhereRelation[];
  targets: TableMap[T][];
  data: any;
};

export type QueryField<T extends ModelType> = {
  whereFields: WhereField<T>[];
  orderFields: OrderField<T>[];
  skip?: number;
  take?: number;
};

export function getSkipTakeFromPage(
  perPage: number | undefined,
  pageNumber: number | undefined,
): { skip: number; take: number } {
  if (perPage == undefined && pageNumber == undefined) {
    // don't do any pagination
    return { skip: NaN, take: NaN };
  }

  // if per page not provided, do no pagination
  if (perPage == undefined || isNaN(parseInt(perPage.toString()))) {
    return { skip: NaN, take: NaN };
  }

  // if pageNumber not provided, assume page 1
  if (pageNumber == undefined || isNaN(parseInt(pageNumber.toString()))) {
    pageNumber = 1;
  }

  if (pageNumber < 0 || perPage < 0) {
    // return 0 results
    return { skip: 0, take: 0 };
  }

  // at this point: per page exists and is gte 0; pageNumber exists and is gte 0
  const take = Math.max(perPage, 0);
  const skip = Math.max((pageNumber - 1) * perPage, 0);

  return { take: take, skip: skip };
}

export function createDynamicRelationObject(relations: Relation[], data: any) {
  /**
   *  Convert an array of relations [relation 1, relation 2, ...] to nested structure
   *  {
   *    [relation 1]:
   *    {
   *      [relation 2]:
   *      {
   *                ....: data
   *      }
   *    }
   *  }
   */
  return relations.reduceRight((acc, relation) => {
    return { [relation]: acc };
  }, data);
}

// delete
export function transformSearchFieldToPrismaQuery<T extends ModelType>(
  searchFields: SearchFieldType<T>[],
) {
  /**
   *  Convert a search field to a prisma query-usable object of relations
   */

  const out = {};

  for (const searchField of searchFields) {
    for (const target of searchField.targets) {
      const nestedRelation = createDynamicRelationObject(
        searchField.relation,
        searchField.data,
      );
      const query = { [target]: nestedRelation };
      Object.assign(out, query);
    }
  }

  return out;
}

export function transformWhereFieldToQuery<T extends ModelType>(
  whereFields: WhereField<T>[],
) {
  const whereQuery = {};
  for (const whereField of whereFields) {
    for (const target of whereField.targets) {
      const nestedRelation = createDynamicRelationObject(
        whereField.relation,
        whereField.data,
      );
      Object.assign(whereQuery, { [target]: nestedRelation });
    }
  }
  return whereQuery;
}

export function transformOrderFieldToQuery<T extends ModelType>(
  orderFields: OrderField<T>[],
) {
  const orderQuery = {};
  for (const orderField of orderFields) {
    for (const target of orderField.targets) {
      Object.assign(orderQuery, { [target]: orderField.relation });
    }
  }
  return orderQuery;
}

export function queryParamsToPrismaQuery<T extends ModelType>(
  params: Partial<ParamMap[T]>,
  transformer: TransformerMap[T],
): { whereQuery: any; orderQuery: any; skip: any; take: any } {
  if (!transformer) {
    // change this
    return {} as { whereQuery: any; orderQuery: any; skip: any; take: any };
  }

  const { whereFields, orderFields, skip, take } = transformer(params);

  const whereQuery = transformWhereFieldToQuery(whereFields);
  const orderQuery = transformOrderFieldToQuery(orderFields);

  return {
    whereQuery: whereQuery,
    orderQuery: orderQuery,
    skip: skip,
    take: take,
  };
}

// export function transformQueryToPrismaQuery<T extends ModelType>(
//   query: Partial<QueryParams>,
//   transformer: QueryTransformer,
// ) {
//   return transformSearchFieldToPrismaQuery(transformer(query));
// }
