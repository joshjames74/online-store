import { Product } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { ProductWithSeller } from "@/api/services/productService";
import { fetchMainProducts } from "../../actions/products";

interface MainProductsState {
    products: ProductWithSeller[],
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