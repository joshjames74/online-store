import { createSlice } from "@reduxjs/toolkit";
import { ReviewWithUser } from "@/api/services/reviewService";
import { fetchMainReview, fetchUserReview } from "@/redux/actions/reviews";

interface UserReviewsState {
    reviews: ReviewWithUser[],
    isLoading: boolean,
    error: string | null
};

const initialState: UserReviewsState = {
    reviews: [],
    isLoading: false,
    error: null
};

const userReviewsSlice = createSlice({
    name: 'userReviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload
            })
            .addCase(fetchMainReview.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch reviews'
            });
    },
});

export default userReviewsSlice;