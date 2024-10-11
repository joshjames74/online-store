"use client"
import { QueryParams } from "@/redux/reducers/product";
import { useRouter } from "next/navigation";
import { create } from "zustand";



export interface SearchState {
    searchParams: Partial<QueryParams>;
    setSearchParams: (params: Partial<QueryParams>) => void;
    getURLSearchParams: () => string;
    isLoading: boolean;
    setIsLoading: (status: boolean) => void;
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
        setIsLoading: (status) => set({ isLoading: status })
    })
})