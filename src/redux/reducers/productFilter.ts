import { PayloadAction } from "@reduxjs/toolkit";
import { ProductFilterState } from "../slices/filters/productFilter";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";


// set methods

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


// clear methods

const clearQuery = (state: ProductFilterState) => {
    state.query = "";
};

const clearMaxPrice = (state: ProductFilterState) => {
    state.max_price = 0;
};

const clearMinReview = (state: ProductFilterState) => {
    state.min_review = 0;
};

const clearCategories = (state: ProductFilterState) => {
    state.categories = [];
};

const clearProductFilter = (state: ProductFilterState) => {
    state.product_filter = undefined;
};

const clearPageNumber = (state: ProductFilterState) => {
    state.pageNumber = 1;
};

const clearPerPage = (state: ProductFilterState) => {
    state.perPage = 20;
};

const clearFilters = (state: ProductFilterState) => {
    state.query = "",
    state.max_price = 0;
    state.min_review = 0;
    state.categories = [];
    state.product_filter = undefined;
    state.pageNumber = 1;
    state.perPage = 20;
};




export { 
    setQuery, setMaxPrice, setMinReview, setCategories, setProductFilter, setPageNumber, setPerPage, clearQuery, clearMaxPrice, clearMinReview, clearCategories, clearProductFilter, clearPageNumber, clearPerPage, clearFilters };