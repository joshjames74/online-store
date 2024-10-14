import { Review } from "@prisma/client";
import { deleteOneEntityByField, getEntitiesByField, getEntitiesByFields, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";
import { ReviewParams, reviewQueryTransformer } from "../transformers/reviewSearchTransformer";
import { queryParamsToPrismaQuery, transformQueryToPrismaQuery } from "../transformers";


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

export async function getReviewsBySearch(params: Partial<ReviewParams>): Promise<Review[] | void> {
    const { whereQuery, orderQuery} = queryParamsToPrismaQuery(params, reviewQueryTransformer);
    const reviews = await getEntitiesByFields('review', whereQuery, orderQuery);
    return reviews
}

// POST methods

export async function postReview(review: Omit<Review, 'review_id'>): Promise<Review | void> {
    return postOneEntity('review', review);
}


// DELETE methods

export async function deleteReviewById(id: number): Promise<Review | void> {
    return deleteOneEntityByField('review', 'id', id);
}