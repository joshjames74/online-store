import { Review } from "@prisma/client";
import {
  ReviewFilter,
  ReviewParams,
} from "../transformers/reviewSearchTransformer";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

export type ReviewWithUser = ResultType<"review", { usr: true }>;

// review filter

export function getReviewFilterOrder(
  review_filter: ReviewFilter,
): "asc" | "desc" {
  if (
    review_filter === ReviewFilter.DATE_NEW_TO_OLD ||
    review_filter === ReviewFilter.SCORE_HIGH_TO_LOW
  ) {
    return "desc";
  }
  return "asc";
}

export function getReviewFilterColumn(
  review_filter: ReviewFilter,
): "score" | "date" {
  if (
    review_filter === ReviewFilter.SCORE_HIGH_TO_LOW ||
    review_filter === ReviewFilter.SCORE_LOW_TO_HIGH
  ) {
    return "score";
  }
  return "date";
}

// Create query from search

export function createWhereQueryFromParams(params: Partial<ReviewParams>) {
  const { productId, score } = params;

  const whereQuery = {};
  if (productId) {
    Object.assign(whereQuery, { productId: productId });
  }
  if (score) {
    Object.assign(whereQuery, { score: { equals: score } });
  }

  return whereQuery;
}

export function createOrderByQueryFromParams(params: Partial<ReviewParams>) {
  const { review_filter } = params;

  const orderByQuery = {};
  if (review_filter) {
    const order = getReviewFilterOrder(review_filter);
    const column = getReviewFilterColumn(review_filter);
    Object.assign(orderByQuery, { [column]: order });
  }

  return orderByQuery;
}

// GET methods

export async function getReviewById(id: number): Promise<Review | null> {
  return await prisma.review.findFirst({
    where: { id: id },
  });
}

export async function getReviewsByProductId(
  id: number,
): Promise<Review[] | void> {
  return await prisma.review.findMany({
    where: { productId: id },
  });
}

export async function getReviewsByUserId(id: number): Promise<Review[] | void> {
  return await prisma.review.findMany({
    where: { usrId: id },
  });
}

export async function getReviewsBySearch(
  params: Partial<ReviewParams>,
): Promise<ReviewWithUser[] | void> {
  const whereQuery = createWhereQueryFromParams(params);
  const orderQuery = createOrderByQueryFromParams(params);

  return await prisma.review.findMany({
    where: whereQuery,
    orderBy: orderQuery,
    include: { usr: true },
  });
}

export async function getReviewCountsByProductId(
  id: number,
): Promise<number[] | void> {
  const response = await prisma.review.groupBy({
    by: ["score"],
    where: { productId: id },
    _count: { score: true },
  });

  const counts: number[] = Array.from({ length: 6 }, () => 0);
  response.forEach((item) => {
    counts[item.score] = item._count.score;
  });

  return counts;
}

// POST methods

export async function postReview(
  review: Omit<Review, "review_id">,
): Promise<Review | void> {
  return prisma.$transaction(async (tx) => {
    // find product and compute new scores
    const product = await tx.product.findFirst({
      where: { id: review.productId },
    });
    if (!product) {
      throw new Error("Cannot find product");
    }
    const new_count = product.review_count + 1;
    const new_score =
      (product.review_score * product.review_count + review.score) / new_count;

    // update product
    const updated_product = await tx.product.update({
      where: { id: review.productId },
      data: {
        review_count: new_count,
        review_score: new_score,
      },
    });
    if (!updated_product) {
      throw new Error("Cannot update product");
    }

    // create review
    const new_review = await tx.review.create({ data: review });
    if (!new_review) {
      throw new Error("Cannot create review");
    }

    return review;
  });
}

// DELETE methods

export async function deleteReviewById(id: number): Promise<Review | void> {
  return prisma.$transaction(async (tx) => {
    // find review
    const review = await tx.review.findFirst({ where: { id: id } });
    if (!review) {
      throw new Error("Cannot find review");
    }

    // find product from review
    const product = await tx.product.findFirst({
      where: { id: review.productId },
    });
    if (!product) {
      throw new Error("Cannot find product");
    }

    // compute new scores
    const new_count = product.review_count - 1;
    const new_score =
      (product.review_score * product.review_count - review.score) / new_count;

    // update product
    const updated_product = await tx.product.update({
      where: { id: product.id },
      data: {
        review_count: new_count,
        review_score: new_score,
      },
    });
    if (!updated_product) {
      throw new Error("Cannot update product");
    }

    // create review
    const deleted_review = await tx.review.delete({ where: { id: id } });
    if (!deleted_review) {
      throw new Error("Cannot delete review");
    }

    return deleted_review;
  });
}
