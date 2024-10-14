import { Review } from "@prisma/client";

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
