import { ProductFilter, ProductParams } from "@/api/transformers/productSearchTransformer";
import { create } from "zustand";
import { useSearchResultsState } from "./store";
import { ManyWithMetadata } from "@/api/helpers/types";


export const defaultParams: Partial<ProductParams> = {
  query: "",
  min_review: 0,
  max_price: 0,
  perPage: 20,
  pageNumber: 1,
};
export const defaultResults = {} as ManyWithMetadata<"product", { seller: true }>;


export interface SearchParamsState {
  params: Partial<ProductParams>;
  // update functions
  updateQuery: (query: string) => void;
  updateMaxPrice: (max_price: number) => void;
  updateMinReview: (min_review: number) => void;
  updateCategories: (categories: number[]) => void;
  updateProductFilter: (product_filter: ProductFilter) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePerPage: (perPage: number) => void;
  // trigger function
  executeSearch: () => void;
  // clear
  clearParams: () => void;
}

export const useSearchParamsState = create<SearchParamsState>((set, get) => ({
  params: defaultParams,
  updateQuery: (query: string) =>
    set((state) => ({ params: { ...state.params, query: query } })),
  updateMaxPrice: (max_price: number) =>
    set((state) => ({ params: { ...state.params, max_price: max_price } })),
  updateMinReview: (min_review: number) =>
    set((state) => ({ params: { ...get().params, min_review: min_review } })),
  updateCategories: (categories: number[]) =>
    set((state) => ({ params: { ...state.params, categories: categories } })),
  updateProductFilter: (product_filter: ProductFilter) =>
    set((state) => ({
      params: { ...state.params, product_filter: product_filter },
    })),
  updatePageNumber: (pageNumber: number) =>
    set((state) => ({ params: { ...state.params, pageNumber: pageNumber } })),
  updatePerPage: (perPage: number) =>
    set((state) => ({ params: { ...state.params, perPage: perPage } })),
  executeSearch: () => {
    const params = get().params;
    useSearchResultsState.getState().fetchAllData(params);
  },
  clearParams: () => {
    // do not update perPage when clearing params
    set(() => ({
      params: { ...defaultParams, perPage: get().params.perPage },
    }));
    get().executeSearch();
  },
}));