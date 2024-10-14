import { QueryParams } from "@/redux/reducers/product";
import { ModelType, TableMap } from "../helpers/types";
import { ProductParams, ProductQueryTransformer } from "./productSearchTransformer";
import { ReviewParams, ReviewQueryTransformer } from "./reviewSearchTransformer";


export type QueryTransformer = ProductQueryTransformer;

export type TransformerMap = {
    address: null,
    basket: null,
    basket_item: null,
    category: null,
    country: null,
    currency: null,
    order: null,
    order_item: null,
    product: ProductQueryTransformer,
    review: ReviewQueryTransformer,
    usr: null,
}

export type ParamMap = {
    address: null,
    basket: null,
    basket_item: null,
    category: null,
    country: null,
    currency: null,
    order: null,
    order_item: null,
    product: ProductParams,
    review: ReviewParams,
    usr: null,
}

// delete
export enum PrismaRelation {
    CONTAINS = "contains",
    LESS_THAN = "lt",
    LESS_THAN_OR_EQUAL = "lte",
    GREATER_THAN = "gt",
    GREATHER_THAN_OR_EQUAL = "gte",
    EQUALS = "equals",
    NOT = "not",
    SOME = "some",
    ID = "categoryId",
    IN = "in"
}


// delete
export type SearchFieldType<T extends ModelType> = {
    data: any,
    targets: TableMap[T][],
    relation: PrismaRelation[],
}


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
    IN = "in"
}

export enum OrderRelation {
    ASC = "asc",
    DESC = "desc"
}


// define fields

export type OrderField<T extends ModelType> = {
    targets: TableMap[T][],
    relation: OrderRelation
}

export type WhereField<T extends ModelType> = {
    relation: WhereRelation[],
    targets: TableMap[T][],
    data: any
};

export type QueryField<T extends ModelType> = {
    whereFields: WhereField<T>[],
    orderFields: OrderField<T>[]
}








export function createDynamicRelationObject(relations: WhereRelation[], data: any) {
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
};


// delete
export function transformSearchFieldToPrismaQuery<T extends ModelType>(searchFields: SearchFieldType<T>[]) {

    /**
     *  Convert a search field to a prisma query-usable object of relations
     */

    var out = {}

    for (const searchField of searchFields) {
        for (const target of searchField.targets) {
            const nestedRelation = createDynamicRelationObject(searchField.relation, searchField.data);
            const query = { [target]: nestedRelation }
            Object.assign(out, query);
        };
    }

    return out;
};


export function transformWhereFieldToQuery<T extends ModelType>(whereFields: WhereField<T>[]) {
    var whereQuery = {}
    for (const whereField of whereFields) {
        for (const target of whereField.targets) {
            const nestedRelation = createDynamicRelationObject(whereField.relation, whereField.data);
            Object.assign(whereQuery, { [target]: nestedRelation });
        }
    }
    return whereQuery;
}


export function transformOrderFieldToQuery<T extends ModelType>(orderFields: OrderField<T>[]) {
    var orderQuery = {}
    for (const orderField of orderFields) {
        for (const target of orderField.targets) {
            Object.assign(orderQuery, { [target]: orderField.relation });
        };
    };
    return orderQuery
}


export function queryParamsToPrismaQuery<T extends ModelType>(params: Partial<ParamMap[T]>, transformer: TransformerMap[T]) {
    
    const { whereFields, orderFields } = transformer(params);
    
    const whereQuery = transformWhereFieldToQuery(whereFields);
    const orderQuery = transformOrderFieldToQuery(orderFields);

    return { whereQuery: whereQuery, orderQuery: orderQuery}
}

export function transformQueryToPrismaQuery<T extends ModelType>(query: Partial<QueryParams>, transformer: QueryTransformer) {
    return transformSearchFieldToPrismaQuery(transformer(query));
};
