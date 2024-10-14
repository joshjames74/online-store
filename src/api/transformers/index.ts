import { QueryParams } from "@/redux/reducers/product";
import { ModelType, TableMap } from "../helpers/types";
import { ProductQueryTransformer } from "./productSearchTransformer";


export type QueryTransformer = ProductQueryTransformer;

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

export type SearchFieldType<T extends ModelType> = {
    data: any,
    targets: TableMap[T][],
    relation: PrismaRelation[],
}


export function createDynamicRelationObject(relations: PrismaRelation[], data: any) {
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


export function transformQueryToPrismaQuery<T extends ModelType>(query: Partial<QueryParams>, transformer: QueryTransformer) {
    return transformSearchFieldToPrismaQuery(transformer(query));
};
