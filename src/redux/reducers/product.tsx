import { Product } from "@prisma/client";
import { Reducer } from "redux";

export enum Width {
    WIDE = 20,
    COMPACT = 60
}


// State types

export interface QueryParams {
    query: string;
    max_price: number;
    min_review: number;
    categories: number[];
    width: Width;
}

export interface ProductState {
    products: Product[];
    query_params: QueryParams;
}


// Initial values

const initialQueryParams: QueryParams = {
    query: "",
    max_price: -1,
    min_review: 0,
    categories: [1],
    width: Width.WIDE
}

const initialState: ProductState = {
    products: [],
    query_params: initialQueryParams
}


// Reducer

export const productReducer: Reducer<ProductState, any> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        default:
            return state;
    }
}