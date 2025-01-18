import { ProductParams } from "@/api/transformers/productSearchTransformer";
import { createSlice } from "@reduxjs/toolkit";
import { setCategories, setMaxPrice, setMinReview, setPageNumber, setPerPage, setProductFilter, setQuery } from "../reducers/productFilter";


export type ProductFilterState = Partial<ProductParams>;

export const initialState = {} as ProductFilterState;


// create slice

const createProductFilterSlice = (name: string) => {
    return createSlice({
        name, 
        initialState,
        reducers: {
            setQuery,
            setMaxPrice,
            setMinReview,
            setCategories,
            setProductFilter,
            setPageNumber,
            setPerPage
        },
    });
};


export default createProductFilterSlice;