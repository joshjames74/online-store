"use client";
import { getBasketByUserId } from "@/api/request/basketRequest";
import { Basket } from "@/api/services/basketItemService";
import { OrderParams } from "@/api/transformers/orderSearchTransformer";
import {
  ProductFilter,
  ProductParams,
} from "@/api/transformers/productSearchTransformer";
import { ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { create } from "zustand";

export type BasketItemCoreProperties = { [key: number]: number };

// Search states

export interface SearchState {
  params: Partial<ProductParams>;
  setParams: (params: Partial<ProductParams>) => void;
  getURLSearchParams: () => string;
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
  clearParams: () => void;
  resultsCount: number;
  setResultsCount: (count: number) => void;
  getMaxPages: () => number;
}

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
// Search states

export const useSearchStore = create<SearchState>((set, get) => {
  return {
    params: {
      query: "",
      min_review: 0,
      max_price: 0,
      perPage: NaN,
      pageNumber: NaN,
    },
    setParams: (params) => set({ params: { ...get().params, ...params } }),
    getURLSearchParams: () => {
      const searchParams = get().params;
      const urlSearchParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        urlSearchParams.append(key, value.toString());
      });
      return urlSearchParams.toString();
    },
    isLoading: false,
    setIsLoading: (status) => set({ isLoading: status }),
    // remove all params except pagination. to do: remove product_filter
    clearParams: () =>
      set({
        params: {
          ...get().params,
          query: "",
          min_review: 0,
          max_price: 0,
          categories: [],
          product_filter: NaN,
        },
      }),
    resultsCount: 0,
    setResultsCount: (count: number) => set({ resultsCount: count }),
    getMaxPages: () =>
      Math.ceil(Math.max(get().resultsCount / (get().params.perPage || -1), 0)),
  };
});

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
