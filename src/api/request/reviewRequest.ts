import { Review } from "@prisma/client";
import axios from "axios";
import { ReviewParams } from "../transformers/reviewSearchTransformer";
import { buildUrl } from "../helpers/utils";
import { fetchData } from ".";
import { ReviewWithUser } from "../services/reviewService";

// GET methods

export async function getReviewById(id: number): Promise<Review> {
  return fetchData<Review>(`/api/review/${id}`);
}

export async function getReviewsByProductId(
  id: number,
  cache?: RequestCache,
): Promise<Review[]> {
  return fetchData<Review[]>(`/api/product/${id}/reviews`, cache);
}

export async function getReviewCountsByProductId(
  id: number,
  cache?: RequestCache,
): Promise<number[]> {
  return fetchData<number[]>(`/api/product/${id}/reviews/summary`, cache);
}

export async function getReviewsBySearch(
  params: Partial<ReviewParams>,
  cache?: RequestCache,
): Promise<ReviewWithUser[]> {
  const url = buildUrl("/api/review", params);
  return fetchData<ReviewWithUser[]>(url, cache);
}

// POST methods

export async function postReview(review: Partial<Review>): Promise<Review> {
  console.log("Posting review...");
  const response = await fetch("/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    throw new Error("Failed to create review");
  };
  return response.json();
}

// DELETE methods

export async function deleteReviewById(id: number): Promise<void> {
  const response = await axios.delete(`/api/review/${id}`);
  return;
}
