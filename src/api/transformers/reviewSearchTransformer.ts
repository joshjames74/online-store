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
