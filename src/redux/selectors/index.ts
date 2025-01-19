import { RootState } from "../store";


export const selectSellerProductFilters = (state: RootState) => state.sellerProductFilter;
export const selectMainProductFilters = (state: RootState) => state.mainProductFilter;

export const selectSellerProducts = (state: RootState) => state.sellerProducts;
export const selectMainProducts = (state: RootState) => state.mainProducts;