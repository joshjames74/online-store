import { Review } from "@prisma/client";
import axios from "axios";
import { ReviewParams } from "../transformers/reviewSearchTransformer";


// GET methods

export async function getReviewById(id: number): Promise<Review> {
    const response = await fetch(`/api/review/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}


export async function getReviewsByProductId(id: number): Promise<Review[]> {
    const response = await fetch(`/api/product/${id}/reviews`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}

export async function getReviewCountsByProductId(id: number): Promise<number[]> {
    const response = await fetch(`/api/product/${id}/reviews/summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    };
    return response.json();
}


export async function getReviewsBySearch(params: Partial<ReviewParams>): Promise<Review[]> {
    const response = await axios(`/api/review`, {
        method: "GET",
        params: {...params}
    });
    return response.data;
}



// POST methods

export async function postReview(review: Partial<Review>): Promise<Review> {
    const response = await axios.post('/api/review', {...review});
    return response.data;
}


// DELETE methods

export async function deleteReviewById(id: number): Promise<void> {
    const response = await axios.delete(`/api/review/${id}`);
    return 
}