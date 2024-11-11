import { Review } from "@prisma/client";
import axios from "axios";
import { ReviewParams } from "../transformers/reviewSearchTransformer";
import { ResultType } from "../helpers/types";
import { buildUrl } from "../helpers/utils";


// GET methods

export async function getReviewById(id: number): Promise<Review> {
    const response = await fetch(`/api/review/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}


export async function getReviewsByProductId(id: number, cache?: RequestCache): Promise<Review[]> {
    const response = await fetch(`/api/product/${id}/reviews`, {
        method: "GET",
        cache: cache ? cache : "force-cache"
    });
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
}

export async function getReviewCountsByProductId(id: number, cache?: RequestCache): Promise<number[]> {
    const response = await fetch(`/api/product/${id}/reviews/summary`, {
        method: "GET",
        cache: cache ? cache : "force-cache"
    });
    if (!response.ok) {
        throw new Error('Failed to fetch');
    };
    return response.json();
}


export async function getReviewsBySearch(params: Partial<ReviewParams>, cache?: RequestCache): Promise<ResultType<'review', { usr: true }>[]> {
    const url = buildUrl('/api/review', params);
    const response = await fetch(url, {
        method: "GET",
        cache: cache ? cache : "force-cache"
    });
    if (!response.ok) {
        throw new Error('Failed to fetch');
    }
    return response.json();
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