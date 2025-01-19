import { createSlice } from "@reduxjs/toolkit";
import { ReviewWithUser } from "@/api/services/reviewService";
import { fetchMainReview } from "@/redux/actions/reviews";

interface MainReviewsState {
    reviews: ReviewWithUser[],
    isLoading: boolean,
    error: string | null
};

const initialState: MainReviewsState = {
    reviews: [],
    isLoading: false,
    error: null
};

const mainReviewsSlice = createSlice({
    name: 'mainReviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMainReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload
            })
            .addCase(fetchMainReview.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch reviews'
            });
    },
});

export default mainReviewsSlice;