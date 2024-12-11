"use client";
import { ManyWithMetadata } from "@/api/helpers/types";
import { getBasketByUserId } from "@/api/request/basketRequest";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { Basket } from "@/api/services/basketItemService";
import { OrderParams } from "@/api/transformers/orderSearchTransformer";
import {
  ProductFilter,
  ProductParams,
} from "@/api/transformers/productSearchTransformer";
import { ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { create } from "zustand";


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

const defaultParams: Partial<ProductParams> = { query: "", min_review: 0, max_price: 0, perPage: 20, pageNumber: 1 }
const defaultResults = {} as ManyWithMetadata<"product", { seller: true }>;

export const useSearchParamsState = create<SearchParamsState>((set, get) => ({
    params: defaultParams,
    updateQuery: (query: string) => set((state) => ({ params: { ...state.params, query: query }})),
    updateMaxPrice: (max_price: number) => set((state) => ({ params: { ...state.params, max_price: max_price }})),
    updateMinReview: (min_review: number) => set((state) => ({ params: { ...get().params, min_review: min_review }})),
    updateCategories: (categories: number[]) => set((state) => ({ params: { ...state.params, categories: categories }})),
    updateProductFilter: (product_filter: ProductFilter) => set((state) => ({ params: { ...state.params, product_filter: product_filter }})),
    updatePageNumber: (pageNumber: number) => set((state) => ({ params: { ...state.params, pageNumber: pageNumber }})),
    updatePerPage: (perPage: number) => set((state) => ({ params: { ...state.params, perPage: perPage }})),
    executeSearch: () => {
      const params = get().params;
      useSearchResultsState.getState().fetchAllData(params);
    },
    clearParams: () => {
      // do not update perPage when clearing params
      set(() => ({ params: { ...defaultParams, perPage: get().params.perPage } }))
      get().executeSearch();
    }
  })
);

export interface SearchResultsState {
  results: ManyWithMetadata<"product", { seller: true }>;
  resultsCount: number;
  maxPrice: number;
  maxPages: number;
  setMaxPages: (perPage: number) => void;
  fetchSearchResults: (params: Partial<ProductParams>) => Promise<void>;
  fetchMaxPriceWithoutParams: () => Promise<void>; 
  fetchResultsCountWithoutPagination: (params: Partial<ProductParams>) => Promise<void>;
  fetchAllData: (params: Partial<ProductParams>) => Promise<void>;
}

export const useSearchResultsState = create<SearchResultsState>((set, get) => ({
  maxPrice: 0,
  results: defaultResults,
  resultsCount: 0,
  maxPages: 0,
  setMaxPages: () => {
    const perPage = useSearchParamsState.getState().params.perPage;
    const count = get().resultsCount
    const maxPages = Math.ceil(Math.max(count / (perPage || -1), 0))
    set({ maxPages: maxPages })
  },
  fetchSearchResults: async (params: Partial<ProductParams>) => {
    getProductsBySearchParams(params).then(res => {
      if (!res) {
        throw new Error("Error fetching results");
      };
      set({ results: res });
    }).catch(error => {
      console.error(error);
      set({ results: defaultResults })
    });
  },
  fetchMaxPriceWithoutParams: async () => {
    await getProductsBySearchParams({}).then(res => {
      if (!res) {
        throw new Error("Error fetching results");
      };
      set({ maxPrice: res.metadata?.price?.max});
    }).catch(error => {
      console.error(error);
      set({ maxPrice: 0 });
    });
  },
  fetchResultsCountWithoutPagination: async (params: Partial<ProductParams>) => {
    const { perPage, pageNumber, ...paramsWithoutPagination } = params
    await getProductsBySearchParams(paramsWithoutPagination).then(res => {
      if (!res) {
        throw new Error("Error fetching results");
      };
      set({ resultsCount: res.metadata.count });
    }).catch(error => {
      console.error(error);
      set({ resultsCount: 0 });
    });
  },
  fetchAllData: async (params: Partial<ProductParams>) => {
    const fetchState = get();
    await fetchState.fetchMaxPriceWithoutParams();
    await fetchState.fetchResultsCountWithoutPagination(params);
    fetchState.setMaxPages(params.perPage || 0);
    fetchState.fetchSearchResults(params);
    }
}))

export type BasketItemCoreProperties = { [key: number]: number };

// // Search states

// export interface SearchState {
//   params: Partial<ProductParams>;
//   setParams: (params: Partial<ProductParams>) => void;
//   getURLSearchParams: () => string;
//   isLoading: boolean;
//   setIsLoading: (status: boolean) => void;
//   clearParams: () => void;
//   resultsCount: number;
//   setResultsCount: (count: number) => void;
//   getMaxPages: () => number;
// }

export interface ReviewSearchState {
  params: Partial<ReviewParams>;
  setParams: (params: Partial<ReviewParams>) => void;
  getAsUrl: () => string;
  clearParams: () => void;
}

export interface OrderSearchState {
  params: Partial<OrderParams>;
  setParams: (params: Partial<OrderParams>) => void;
  getAsUrl: () => string;
  clearParams: () => void;
}

// Storage states

export interface BasketState {
  basket: Basket;
  setBasket: (basket: Basket) => void;
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
  loadData: (id: number) => Promise<void>;
}

// TO DO: look at repeated code for search states


// // Search states

// export const useSearchStore = create<SearchState>((set, get) => {
//   return {
//     params: {
//       query: "",
//       min_review: 0,
//       max_price: 0,
//       perPage: NaN,
//       pageNumber: NaN,
//     },
//     setParams: (params) => set({ params: { ...get().params, ...params } }),
//     getURLSearchParams: () => {
//       const searchParams = get().params;
//       const urlSearchParams = new URLSearchParams();
//       Object.entries(searchParams).forEach(([key, value]) => {
//         urlSearchParams.append(key, value.toString());
//       });
//       return urlSearchParams.toString();
//     },
//     isLoading: false,
//     setIsLoading: (status) => set({ isLoading: status }),
//     // remove all params except pagination. to do: remove product_filter
//     clearParams: () =>
//       set({
//         params: {
//           ...get().params,
//           query: "",
//           min_review: 0,
//           max_price: 0,
//           categories: [],
//           product_filter: NaN,
//         },
//       }),
//     resultsCount: 0,
//     setResultsCount: (count: number) => set({ resultsCount: count }),
//     getMaxPages: () =>
//       Math.ceil(Math.max(get().resultsCount / (get().params.perPage || -1), 0)),
//   };
// });

export const useReviewSearchStore = create<ReviewSearchState>((set, get) => {
  return {
    params: {},
    setParams: (params) => set({ params: { ...get().params, ...params } }),
    getAsUrl: () => {
      const params = get().params;
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value.toString());
      });
      return urlParams.toString();
    },
    clearParams: () => set({ params: {} }),
  };
});

export const useOrderSearchStore = create<OrderSearchState>((set, get) => {
  return {
    params: {},
    setParams: (params) => set({ params: { ...get().params, ...params } }),
    getAsUrl: () => {
      const params = get().params;
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value.toString());
      });
      return urlParams.toString();
    },
    clearParams: () => set({ params: {} }),
  };
});

// Storage states

export const useBasketStore = create<BasketState>((set) => {
  return {
    basket: {},
    setBasket: (basket: Basket) => set({ basket: basket }),
    loadData: async (id: number) => {
      set({ isLoading: true });
      getBasketByUserId(id)
        .then((res) => {
          set({ basket: res });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          set({ isLoading: false });
        });
    },
    isLoading: false,
    setIsLoading: (status: boolean) => set({ isLoading: status }),
  };
});
