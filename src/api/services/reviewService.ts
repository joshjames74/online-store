import { Review } from "@prisma/client";
import {
  deleteOneEntityByField,
  getEntitiesByField,
  getEntitiesByFields,
  getOneEntityByField,
  postOneEntity,
} from "../helpers/dynamicQuery";
import {
  ReviewParams,
  reviewQueryTransformer,
} from "../transformers/reviewSearchTransformer";
import {
  queryParamsToPrismaQuery,
  transformQueryToPrismaQuery,
} from "../transformers";
import { ResultType } from "../helpers/types";
import prisma from "@/lib/prisma";

// GET methods

export async function getReviewById(id: number): Promise<Review | void> {
  return await getOneEntityByField("review", "id", id);
}

export async function getReviewsByProductId(
  id: number,
): Promise<Review[] | void> {
  return getEntitiesByField("review", "productId", id);
}

export async function getReviewsByUserId(id: number): Promise<Review[] | void> {
  return getEntitiesByField("review", "usrId", id);
}

export async function getReviewsBySearch(
  params: Partial<ReviewParams>,
): Promise<ResultType<"review", { usr: true }>[] | void> {
  const { whereQuery, orderQuery } = queryParamsToPrismaQuery(
    params,
    reviewQueryTransformer,
  );
  return await getEntitiesByFields(
    "review",
    whereQuery,
    orderQuery,
    undefined,
    undefined,
    { usr: true },
  );
}

export async function getReviewCountsByProductId(
  id: number,
): Promise<number[] | void> {
  const arr: number[] = Array.from({ length: 6 });
  return await Promise.all(
    arr.map(async (_, index) => {
      const reviews = await getEntitiesByFields("review", {
        score: index,
        productId: id,
      });
      return reviews ? reviews.length : 0;
    }),
  );
}


// POST methods

export async function postReview(
  review: Omit<Review, "review_id">,
): Promise<Review | void> {
  
  return prisma.$transaction(async (tx) => {

    // find product and compute new scores
    const product = await tx.product.findFirst({ where: { id: review.productId }});
    if (!product) { throw new Error('Cannot find product'); }
    const new_count = product.review_count + 1;
    const new_score = ((product.review_score * product.review_count) + review.score) / new_count;

    // update product
    const updated_product = await tx.product.update({
      where: { id: review.productId },
      data: {
        review_count: new_count,
        review_score: new_score,
      }
    });
    if (!updated_product) { throw new Error('Cannot update product') };

    // create review
    const new_review = await tx.review.create({ data: review });
    if (!new_review) { throw new Error('Cannot create review')};

    return review;
  });
}


// DELETE methods

export async function deleteReviewById(id: number): Promise<Review | void> {
  return deleteOneEntityByField("review", "id", id);
}
