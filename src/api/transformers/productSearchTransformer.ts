import {
  getSkipTakeFromPage,
  OrderField,
  OrderRelation,
  QueryField,
  WhereField,
  WhereRelation,
} from ".";
import { TableMap } from "../helpers/types.js";

export type ProductQueryTransformer = (
  params: Partial<ProductParams>,
) => QueryField<"product">;

export enum ProductFilter {
  PRICE_LOW_TO_HIGH = 1,
  PRICE_HIGH_TO_LOW = 2,
}

export enum Width {
  WIDE = 20,
  COMPACT = 60,
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
};

export const productQueryTransformer: ProductQueryTransformer = (
  params: Partial<ProductParams>,
): QueryField<"product"> => {
  const whereFields: WhereField<"product">[] = [];
  const orderFields: OrderField<"product">[] = [];

  if (params.query) {
    whereFields.push({
      targets: ["title", "description"],
      data: params.query.toLowerCase(),
      relation: [WhereRelation.CONTAINS],
    });
  }

  if (params.max_price) {
    whereFields.push({
      targets: ["price"],
      data: params.max_price,
      relation: [WhereRelation.LESS_THAN_OR_EQUAL],
    });
  }

  if (params.min_review) {
    whereFields.push({
      targets: ["review_score"],
      data: params.min_review,
      relation: [WhereRelation.GREATHER_THAN_OR_EQUAL],
    });
  }

  if (params.categories && params.categories.length) {
    whereFields.push({
      targets: ["categories"],
      data: params.categories,
      relation: [WhereRelation.SOME, WhereRelation.ID, WhereRelation.IN],
    });
  }

  if (params.product_filter) {
    let relation: OrderRelation = OrderRelation.ASC;
    let targets: TableMap["product"][] = [];

    // if descending order
    if (params.product_filter === ProductFilter.PRICE_HIGH_TO_LOW) {
      relation = OrderRelation.DESC;
    }

    // if ascending order
    if (params.product_filter === ProductFilter.PRICE_LOW_TO_HIGH) {
      relation = OrderRelation.ASC;
    }

    // if relating to price
    if (
      params.product_filter === ProductFilter.PRICE_HIGH_TO_LOW ||
      params.product_filter === ProductFilter.PRICE_LOW_TO_HIGH
    ) {
      targets = ["price"];
    }

    orderFields.push({
      relation: relation,
      targets: targets,
    });
  }

  const { take, skip } = getSkipTakeFromPage(params.perPage, params.pageNumber);

  return {
    whereFields: whereFields,
    orderFields: orderFields,
    take: take,
    skip: skip,
  };
};
