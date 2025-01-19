import { getProductsBySearchParams } from "@/api/request/productRequest";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchMainProducts = createAsyncThunk(
    'mainProducts/fetchFiltered',
    async (_, { getState }) => {

        const state = getState() as RootState;
        const filters = state.mainProductFilter;

        const response = await getProductsBySearchParams(filters);
        return response.data;
    }
);