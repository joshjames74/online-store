import { configureStore } from "@reduxjs/toolkit";
import createProductFilterSlice from "../slices/productFilter";


const mainProductFilterSlice = createProductFilterSlice('mainProductFilter');
const sellerProductFilterSlice = createProductFilterSlice('sellerProductFilterSlice');

export const store = configureStore({
    reducer: {
        mainProductFilter: mainProductFilterSlice.reducer,
        sellerProductFilter: sellerProductFilterSlice.reducer,
    },
});


// slice actions

export const {
    setQuery: setMainProductQuery,
    setMaxPrice: setMainProductMaxPrice,
    setMinReview: setMainProductMinReview,
    setCategories: setMainProductCategory,
    setProductFilter: setMainProductProductFilter,
    setPageNumber: setMainProductPageNumber,
    setPerPage: setMainProductPerPage,
} = mainProductFilterSlice.actions;


export const {
    setQuery: setSellerProductQuery,
    setMaxPrice: setSellerProductMaxPrice,
    setMinReview: setSellerProductMinReview,
    setCategories: setSellerProductCategory,
    setProductFilter: setSellerProductProductFilter,
    setPageNumber: setSellerProductPageNumber,
    setPerPage: setSellerProductPerPage,
} = sellerProductFilterSlice.actions;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
