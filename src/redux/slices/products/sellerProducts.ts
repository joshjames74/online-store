import { Product } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { fetchSellerProducts } from "../../actions/products";

interface SellerProductsState {
    products: Product[],
    isLoading: boolean,
    error: string | null
};

const initialState: SellerProductsState = {
    products: [],
    isLoading: false,
    error: null
};

const sellerProductsSlice = createSlice({
    name: 'sellerProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload
            })
            .addCase(fetchSellerProducts.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch products'
            });
    },
});

export default sellerProductsSlice;