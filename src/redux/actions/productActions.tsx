import { Product } from "@prisma/client";
import { QueryParams } from "../reducers/product";

export const setProducts = (products: Product[]) => ({
  type: "SET_PRODUCTS" as const,
  payload: products,
});

export const setQueryParams = (params: Partial<QueryParams>) => ({
  type: "SET_QUERY_PARAMS" as const,
  payload: params,
});

export type ProductActionTypes =
  | ReturnType<typeof setProducts>
  | ReturnType<typeof setQueryParams>;
