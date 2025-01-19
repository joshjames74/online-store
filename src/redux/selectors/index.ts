import { RootState } from "../store";


// Filters

// product
export const selectSellerProductFilters = (state: RootState) => state.sellerProductFilter;
export const selectMainProductFilters = (state: RootState) => state.mainProductFilter;

// review
export const selectMainReviewFilters = (state: RootState) => state.mainReviewFilter;
export const selectUserReviewFilters = (state: RootState) => state.userReviewsFilter;


// Model States

// product
export const selectSellerProducts = (state: RootState) => state.sellerProducts;
export const selectMainProducts = (state: RootState) => state.mainProducts;

// review
export const selectMainReviews = (state: RootState) => state.mainReviews;
export const selectUserReviews = (state: RootState) => state.userReviews;

