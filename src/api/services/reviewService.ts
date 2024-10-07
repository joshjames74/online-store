import { Review } from "@prisma/client";
import { getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";


// GET methods

export async function getReviewById(id: number): Promise<Review | void> {
    return await getOneEntityByField('review', 'id', id);
}


// POST methods

export async function postReview(review: Omit<Review, 'review_id'>): Promise<Review | void> {
    return postOneEntity('review', review);
}