import { QueryParams } from "@/redux/reducers/product";
import { PrismaRelation, SearchFieldType } from ".";
import { ModelType } from "../helpers/types";


export type ProductQueryTransformer= (query: QueryParams) => SearchFieldType<'product'>[];


export const productSearchTransformer: ProductQueryTransformer = (params: QueryParams): SearchFieldType<'product'>[] => {

    /**
     *  Transform search parameters into a custom seach field type for a particular search
     */

    var searchFields: SearchFieldType<'product'>[] = [];

    if (params.query) {
        searchFields.push({ 
            targets: ['title', 'description'], 
            data: params.query, 
            relation: [PrismaRelation.CONTAINS] 
        })
    }

    if (params.max_price) {
        searchFields.push({
            targets: ['price'],
            data: params.max_price,
            relation: [PrismaRelation.LESS_THAN_OR_EQUAL]
        });
    };

    if (params.min_review) {
        searchFields.push({
            targets: ['review_score'],
            data: params.min_review,
            relation: [PrismaRelation.GREATHER_THAN_OR_EQUAL]
        });
    };

    if (params.categories && params.categories.length) {
        searchFields.push({
            targets: ['categories'],
            data: params.categories,
            relation: [PrismaRelation.SOME, PrismaRelation.ID, PrismaRelation.IN]
        })
    }

    return searchFields;
}