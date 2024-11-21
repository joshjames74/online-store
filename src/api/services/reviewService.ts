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
  return postOneEntity("review", review);
}

// DELETE methods

export async function deleteReviewById(id: number): Promise<Review | void> {
  return deleteOneEntityByField("review", "id", id);
}
