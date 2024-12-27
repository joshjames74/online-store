import { ProductsWithMetadata } from "@/api/services/productService";
import { ProductParams } from "@/api/transformers/productSearchTransformer";
import { create } from "zustand";
import { useSearchParamsState } from "./store";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { ManyWithMetadata } from "@/api/helpers/types";


export const defaultParams: Partial<ProductParams> = {
  query: "",
  min_review: 0,
  max_price: 0,
  perPage: 20,
  pageNumber: 1,
};
export const defaultResults = {} as ManyWithMetadata<"product", { seller: true }>;

export interface SearchResultsState {
  results: ProductsWithMetadata;
  resultsCount: number;
  maxPrice: number;
  maxPages: number;
  isLoading: boolean;
  setMaxPages: (perPage: number) => void;
  fetchSearchResults: (params: Partial<ProductParams>) => Promise<void>;
  fetchMaxPriceWithoutParams: () => Promise<void>;
  fetchResultsCountWithoutPagination: (
    params: Partial<ProductParams>,
  ) => Promise<void>;
  fetchAllData: (params: Partial<ProductParams>) => Promise<void>;
}

export const useSearchResultsState = create<SearchResultsState>((set, get) => ({
  maxPrice: 0,
  results: defaultResults,
  resultsCount: 0,
  maxPages: 0,
  isLoading: false,
  setMaxPages: () => {
    const perPage = useSearchParamsState.getState().params.perPage;
    const count = get().resultsCount;
    const maxPages = Math.ceil(Math.max(count / (perPage || -1), 0));
    set({ maxPages: maxPages });
  },
  fetchSearchResults: async (params: Partial<ProductParams>) => {
    getProductsBySearchParams(params)
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ results: res });
      })
      .catch((error) => {
        console.error(error);
        set({ results: defaultResults });
      });
  },
  fetchMaxPriceWithoutParams: async () => {
    await getProductsBySearchParams({})
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ maxPrice: res.metadata?.price?.max });
      })
      .catch((error) => {
        console.error(error);
        set({ maxPrice: 0 });
      });
  },
  fetchResultsCountWithoutPagination: async (
    params: Partial<ProductParams>,
  ) => {
    const { perPage, pageNumber, ...paramsWithoutPagination } = params;
    await getProductsBySearchParams(paramsWithoutPagination)
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ resultsCount: res.metadata.count });
      })
      .catch((error) => {
        console.error(error);
        set({ resultsCount: 0 });
      });
  },
  fetchAllData: async (params: Partial<ProductParams>) => {
    set({ isLoading: true });
    const fetchState = get();
    await fetchState.fetchMaxPriceWithoutParams();
    await fetchState.fetchResultsCountWithoutPagination(params);
    fetchState.setMaxPages(params.perPage || 0);
    await fetchState.fetchSearchResults(params);
    set({ isLoading: false });
  },
}));