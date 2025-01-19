import { Product } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { fetchSellerProducts } from "../actions/sellerProducts";
import { fetchMainProducts } from "../actions/mainProducts";

interface MainProductsState {
    products: Product[],
    isLoading: boolean,
    error: string | null
};

const initialState: MainProductsState = {
    products: [],
    isLoading: false,
    error: null
};

const mainProductsSlice = createSlice({
    name: 'mainProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMainProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload
            })
            .addCase(fetchMainProducts.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch products'
            });
    },
});

export default mainProductsSlice;