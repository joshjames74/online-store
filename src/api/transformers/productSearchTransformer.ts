import { QueryParams } from "@/redux/reducers/product";
import { getSkipTakeFromPage, OrderField, OrderRelation, PrismaRelation, QueryField, SearchFieldType, WhereField, WhereRelation } from ".";
import { ModelType, TableMap } from "../helpers/types";


export type ProductQueryTransformer= (params: Partial<ProductParams>) => QueryField<'product'>;


export enum ProductFilter {
    PRICE_LOW_TO_HIGH = 1,
    PRICE_HIGH_TO_LOW = 2
}


export enum Width {
    WIDE = 20,
    COMPACT = 60
}

export type ProductParams = {
    query: string;
    max_price: number;
    min_review: number;
    categories: number[];
    width: Width;
    product_filter: ProductFilter; 
    pageNumber?: number;
    perPage?: number;
}


export const productQueryTransformer: ProductQueryTransformer = (params: Partial<ProductParams>): QueryField<'product'> => {

    var whereFields:  WhereField<'product'>[] = [];
    var orderFields: OrderField<'product'>[] = [];

    if (params.query) {
        whereFields.push({ 
            targets: ['title', 'description'], 
            data: params.query, 
            relation: [WhereRelation.CONTAINS] 
        })
    }

    if (params.max_price) {
        whereFields.push({
            targets: ['price'],
            data: params.max_price,
            relation: [WhereRelation.LESS_THAN_OR_EQUAL]
        });
    };

    if (params.min_review) {
        whereFields.push({
            targets: ['review_score'],
            data: params.min_review,
            relation: [WhereRelation.GREATHER_THAN_OR_EQUAL]
        });
    };

    if (params.categories && params.categories.length) {
        whereFields.push({
            targets: ['categories'],
            data: params.categories,
            relation: [WhereRelation.SOME, WhereRelation.ID, WhereRelation.IN]
        })
    }

    if (params.product_filter) {
        
        var relation: OrderRelation = OrderRelation.ASC;
        var targets: TableMap['product'][] = [];

        // if descending order
        if (params.product_filter === ProductFilter.PRICE_HIGH_TO_LOW) {
            relation = OrderRelation.DESC;
        };

        // if ascending order
        if (params.product_filter === ProductFilter.PRICE_LOW_TO_HIGH) {
            relation = OrderRelation.ASC
        };

        // if relating to price
        if (params.product_filter === ProductFilter.PRICE_HIGH_TO_LOW || params.product_filter === ProductFilter.PRICE_LOW_TO_HIGH) {
            targets = ['price'];
        };

        orderFields.push({
            relation: relation,
            targets: targets
        })
    }

    const { take, skip } = getSkipTakeFromPage(params.perPage || 0, params.pageNumber || 0);

    return { whereFields: whereFields, orderFields: orderFields, take: take, skip: skip };
}