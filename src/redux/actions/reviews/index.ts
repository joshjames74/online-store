import { getReviewsBySearch } from "@/api/request/reviewRequest";
import { RootState } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchMainReview = createAsyncThunk(
    'mainReviews/fetchFiltered',
    async (_, { getState }) => {

        const state = getState() as RootState;
        const filters = state.mainReviewFilter;

        const response = await getReviewsBySearch(filters);
        return response;
    }
);

export const fetchUserReview = createAsyncThunk(
    'userReviews/fetchFiltered',
    async (_, { getState }) => {

        const state = getState() as RootState;
        const filters = state.userReviewsFilter;

        const response = await getReviewsBySearch(filters);
        return response;
    }
);