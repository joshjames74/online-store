import { createSlice } from "@reduxjs/toolkit";
import { ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { clearStateAndProduct, clearStateWithoutProduct, setFilter, setPageNumber, setPerPage, setProductId, setScore } from "@/redux/reducers/reviewFilter";


export type ReviewFilterState = Partial<ReviewParams>;

export const initialState = {} as ReviewFilterState;


// create slice

const createReviewFilterSlice = (name: string) => {
    return createSlice({
        name, 
        initialState,
        reducers: {
            setProductId,
            setScore,
            setFilter,
            setPerPage,
            setPageNumber,
            clearStateAndProduct,
            clearStateWithoutProduct,
        },
    });
};


export default createReviewFilterSlice;