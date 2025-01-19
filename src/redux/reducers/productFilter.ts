import { PayloadAction } from "@reduxjs/toolkit";
import { ProductFilterState } from "../slices/productFilter";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";


const setQuery = (state: ProductFilterState, action: PayloadAction<string>) => {
    state.query = action.payload;
};

const setMaxPrice = (state: ProductFilterState, action: PayloadAction<number>) => {
    state.max_price = action.payload;
};

const setMinReview = (state: ProductFilterState, action: PayloadAction<number>) => {
    state.min_review = action.payload;
};

const setCategories = (state: ProductFilterState, action: PayloadAction<number[]>) => {
    state.categories = action.payload;
};

const setProductFilter = (state: ProductFilterState, action: PayloadAction<ProductFilter>) => {
    state.product_filter = action.payload;
};

const setPageNumber = (state: ProductFilterState, action: PayloadAction<number>) => {
    state.pageNumber = action.payload;
};

const setPerPage = (state: ProductFilterState, action: PayloadAction<number>) => {
    state.perPage = action.payload;
};


export { setQuery, setMaxPrice, setMinReview, setCategories, setProductFilter, setPageNumber, setPerPage };