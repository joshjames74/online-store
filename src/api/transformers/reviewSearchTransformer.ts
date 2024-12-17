import { S } from "node_modules/@faker-js/faker/dist/airline-BLb3y-7w";
import {
  OrderField,
  OrderRelation,
  QueryField,
  WhereField,
  WhereRelation,
} from ".";
import { TableMap } from "../helpers/types.js";

export type ReviewQueryTransformer = (
  params: Partial<ReviewParams>,
) => QueryField<"review">;

export enum ReviewFilter {
  SCORE_LOW_TO_HIGH = 1,
  SCORE_HIGH_TO_LOW = 2,
  DATE_NEW_TO_OLD = 3,
  DATE_OLD_TO_NEW = 4,
}

export type ReviewParams = {
  productId: number;
  score: number;
  review_filter: ReviewFilter;
  perPage: number;
  pageNumber: number;
};

export const reviewQueryTransformer: ReviewQueryTransformer = (
  params: Partial<ReviewParams>,
): QueryField<"review"> => {
  /**
   *  Transform search parameters into a custom seach field type for a particular search
   */

  const whereFields: WhereField<"review">[] = [];
  const orderFields: OrderField<"review">[] = [];

  if (params.productId) {
    whereFields.push({
      targets: ["productId"],
      data: params.productId,
      relation: [WhereRelation.EQUALS],
    });
  }

  if (params.score) {
    whereFields.push({
      targets: ["score"],
      data: params.score,
      relation: [WhereRelation.EQUALS],
    });
  }

  if (params.review_filter) {
    let relation: OrderRelation = OrderRelation.ASC;
    let targets: TableMap["review"][] = [];

    // if descending order
    if (
      params.review_filter === ReviewFilter.DATE_NEW_TO_OLD ||
      params.review_filter === ReviewFilter.SCORE_HIGH_TO_LOW
    ) {
      relation = OrderRelation.DESC;
    }

    // if ascending order
    if (
      params.review_filter === ReviewFilter.DATE_OLD_TO_NEW ||
      params.review_filter === ReviewFilter.SCORE_LOW_TO_HIGH
    ) {
      relation = OrderRelation.ASC;
    }

    // if relating to score
    if (
      params.review_filter === ReviewFilter.SCORE_HIGH_TO_LOW ||
      params.review_filter === ReviewFilter.SCORE_LOW_TO_HIGH
    ) {
      targets = ["score"];
    }

    // if relating to date
    if (
      params.review_filter === ReviewFilter.DATE_NEW_TO_OLD ||
      params.review_filter === ReviewFilter.DATE_OLD_TO_NEW
    ) {
      targets = ["date"];
    }

    orderFields.push({
      targets: targets,
      relation: relation,
    });
  }

  return {
    whereFields: whereFields,
    orderFields: orderFields,
  };
};
