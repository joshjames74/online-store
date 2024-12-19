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
