import { QueryParams } from "@/redux/reducers/product";
import { OrderField, OrderRelation, PrismaRelation, QueryField, SearchFieldType, WhereField, WhereRelation } from ".";
import { ModelType, TableMap } from "../helpers/types";


export type OrderQueryTransformer= (params: Partial<OrderParams>) => QueryField<'order'>;


export enum OrderFilter {
    DATE_NEW_OLD = 1,
    DATE_OLD_NEW = 2,
    TOTAL_LOW_HIGH = 3,
    TOTAL_HIGH_LOW = 4,
}

export type OrderParams = {
    usrId: number;
    min_date: Date;
    max_date: Date;
    order_filter: OrderFilter; 
    skip?: number;
    take?: number;
}


export const orderQueryTransformer: OrderQueryTransformer = (params: Partial<OrderParams>): QueryField<'order'> => {

    var whereFields:  WhereField<'order'>[] = [];
    var orderFields: OrderField<'order'>[] = [];

    if (params.min_date) {
        whereFields.push({
            targets: ['date'],
            data: params.min_date,
            relation: [WhereRelation.GREATHER_THAN_OR_EQUAL]
        });
    };

    if (params.max_date) {
        whereFields.push({
            targets: ['date'],
            data: params.max_date,
            relation: [WhereRelation.LESS_THAN_OR_EQUAL]
        });
    };

    if (params.usrId) {
        whereFields.push({
            targets: ['usrId'],
            data: params.usrId,
            relation: [WhereRelation.EQUALS]
        });
    };

    if (params.order_filter) {
        
        var relation: OrderRelation = OrderRelation.ASC;
        var targets: TableMap['order'][] = [];

        // if descending order
        if (params.order_filter === OrderFilter.DATE_NEW_OLD || params.order_filter === OrderFilter.TOTAL_HIGH_LOW) {
            relation = OrderRelation.DESC;
        };

        // if ascending order
        if (params.order_filter === OrderFilter.DATE_OLD_NEW || params.order_filter === OrderFilter.TOTAL_LOW_HIGH) {
            relation = OrderRelation.ASC
        };

        // if relating to price
        if ([OrderFilter.DATE_NEW_OLD, OrderFilter.DATE_OLD_NEW].includes(params.order_filter)) {
            targets = ['date'];
        };

        // if relating to total

        orderFields.push({
            relation: relation,
            targets: targets
        })
    }

    return {
        whereFields: whereFields,
        orderFields: orderFields,
        take: params.take,
        skip: params.skip
    };
}