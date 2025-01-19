import { PayloadAction } from "@reduxjs/toolkit";
import { ReviewFilterState } from "../slices/filters/reviewFilter";
import { ReviewFilter } from "@/api/transformers/reviewSearchTransformer";


// set methods

const setProductId = (state: ReviewFilterState, action: PayloadAction<number>) => {
    state.productId = action.payload;
};

const setScore = (state: ReviewFilterState, action: PayloadAction<number>) => {
    state.score = action.payload;
};

const setFilter = (state: ReviewFilterState, action: PayloadAction<ReviewFilter>) => {
    state.review_filter = action.payload;
};

const setPerPage = (state: ReviewFilterState, action: PayloadAction<number>) => {
    state.perPage = action.payload;
};

const setPageNumber = (state: ReviewFilterState, action: PayloadAction<number>) => {
    state.pageNumber = action.payload;
};


// clear methods

const clearStateAndProduct = (state: ReviewFilterState) => {
    state.productId = undefined;
    state.score = undefined;
    state.perPage = 5;
    state.pageNumber = 1;
};

const clearStateWithoutProduct = (state: ReviewFilterState) => {
    state.score = undefined;
    state.perPage = 5;
    state.pageNumber = 1;
};


export { setProductId, setScore, setFilter, setPerPage, setPageNumber, 
        clearStateAndProduct, clearStateWithoutProduct };