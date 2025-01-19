import { configureStore } from "@reduxjs/toolkit";
import createProductFilterSlice from "../slices/filters/productFilter";
import sellerProductsSlice from "../slices/products/sellerProducts";
import mainProductsSlice from "../slices/products/mainProducts";
import createReviewFilterSlice from "../slices/filters/reviewFilter";
import mainReviewsSlice from "../slices/reviews/mainReviews";
import userReviewsSlice from "../slices/reviews/userReviews";


const mainProductFilterSlice = createProductFilterSlice('mainProductFilter');
const sellerProductFilterSlice = createProductFilterSlice('sellerProductFilterSlice');

const mainReviewFilterSlice = createReviewFilterSlice('mainReviewFilter');
const userReviewFilterSlice = createReviewFilterSlice('userReviewFilterSlice');


export const store = configureStore({
    reducer: {

        // filters

        mainProductFilter: mainProductFilterSlice.reducer,
        sellerProductFilter: sellerProductFilterSlice.reducer,
        
        mainReviewFilter: mainReviewFilterSlice.reducer,
        userReviewsFilter: userReviewFilterSlice.reducer,


        // products

        sellerProducts: sellerProductsSlice.reducer,
        mainProducts: mainProductsSlice.reducer,


        // reviews

        mainReviews: mainReviewsSlice.reducer,
        userReviews: userReviewsSlice.reducer,

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
    clearQuery: clearMainProductQuery,
    clearMaxPrice: clearMainProductMaxPrice,
    clearMinReview: clearMainProductMinReview,
    clearCategories: clearMainProductCategories,
    clearProductFilter: clearMainProductProductFilter,
    clearPageNumber: clearMainProductPageNumber,
    clearPerPage: clearMainProductPerPage,
    clearFilters: clearMainProductFilters,
} = mainProductFilterSlice.actions;


export const {
    setQuery: setSellerProductQuery,
    setMaxPrice: setSellerProductMaxPrice,
    setMinReview: setSellerProductMinReview,
    setCategories: setSellerProductCategory,
    setProductFilter: setSellerProductProductFilter,
    setPageNumber: setSellerProductPageNumber,
    setPerPage: setSellerProductPerPage,
    clearQuery: clearSellerProductQuery,
    clearMaxPrice: clearSellerProductMaxPrice,
    clearMinReview: clearSellerProductMinReview,
    clearCategories: clearSellerProductCategories,
    clearProductFilter: clearSellerProductProductFilter,
    clearPageNumber: clearSellerProductPageNumber,
    clearPerPage: clearSellerProductPerPage,
    clearFilters: clearSellerProductFilters,
} = sellerProductFilterSlice.actions;


export const {
    setProductId: setMainReviewProductId,
    setScore: setMainReviewScore,
    setFilter: setMainReviewFilter,
    setPerPage: setMainReviewPerPage,
    setPageNumber: setMainReviewPageNumber,
} = mainReviewFilterSlice.actions;


export const {
    setProductId: setUserReviewProductId,
    setScore: setUserReviewScore,
    setFilter: setUserReviewFilter,
    setPerPage: setUserReviewPerPage,
    setPageNumber: setUserReviewPageNumber
} = userReviewFilterSlice.actions;



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
