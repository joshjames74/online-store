"use client"
import { ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { QueryParams } from "@/redux/reducers/product";
import { useRouter } from "next/navigation";
import { create } from "zustand";



export interface SearchState {
    searchParams: Partial<QueryParams>;
    setSearchParams: (params: Partial<QueryParams>) => void;
    getURLSearchParams: () => string;
    isLoading: boolean;
    setIsLoading: (status: boolean) => void;
    clearParams: () => void;
}

export interface ReviewSearchState {
    params: Partial<ReviewParams>;
    setParams: (params: Partial<ReviewParams>) => void;
    getAsUrl: () => string;
    clearParams: () => void;
}


export const useSearchStore = create<SearchState>((set, get) => {
    return ({
        searchParams: {},
        setSearchParams: (params) => set({ searchParams: { ...get().searchParams, ...params} }),
        getURLSearchParams: () => {
            const searchParams = get().searchParams;
            const urlSearchParams = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                urlSearchParams.append(key, value.toString());
            });
            return urlSearchParams.toString();
        },
        isLoading: false,
        setIsLoading: (status) => set({ isLoading: status }),
        clearParams: () => set({ searchParams: {}})
    })
})

export const useReviewSearchStore = create<ReviewSearchState>((set, get) => {
    return ({
        params: {},
        setParams: (params) => set({ params: { ...get().params, ...params }}),
        getAsUrl: () => {
            const params = get().params;
            const urlParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                urlParams.append(key, value.toString());
            });
            return urlParams.toString();
        },
        clearParams: () => set({ params: {}})
    })
})