import { Review } from "@prisma/client";
import { deleteOneEntityByField, getEntitiesByField, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";


// GET methods

export async function getReviewById(id: number): Promise<Review | void> {
    return await getOneEntityByField('review', 'id', id);
}

export async function getReviewsByProductId(id: number): Promise<Review[] | void> {
    return getEntitiesByField('review', 'productId', id);
}

export async function getReviewsByUserId(id: number): Promise<Review[] | void> {
    return getEntitiesByField('review', 'usrId', id);
}

// get reviews by product id and by rating


// POST methods

export async function postReview(review: Omit<Review, 'review_id'>): Promise<Review | void> {
    return postOneEntity('review', review);
}


// DELETE methods

export async function deleteReviewById(id: number): Promise<Review | void> {
    return deleteOneEntityByField('review', 'id', id);
}