/**
 * @jest-environment node
 */
import { DELETE } from "@/app/api/review/[id]/route";
import prisma from "@/lib/prisma";
import {
  generateMany,
  generateMockProduct,
  generateMockReview,
  generateMockUser,
} from "@/tests/generate";
import { Product, Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";

export const normaliseReviewDate = (review: Review) => {
  return { ...review, date: new Date(review.date).toISOString() };
};

describe("DELETE /api/review/[id]", () => {
  let testProducts: Product[];
  let testUsers: Usr[];
  let testReviews: Review[];

  beforeEach(async () => {
    const count = 2;

    // create users
    const mockUsers = generateMany<Usr>(count, generateMockUser);
    testUsers = await prisma.usr.createManyAndReturn({ data: mockUsers });
    const userIds = testUsers.map((user) => user.id);

    // create products
    const mockProducts = Array.from({ length: count }, () =>
      generateMockProduct(userIds),
    );
    testProducts = await prisma.product.createManyAndReturn({
      data: mockProducts,
    });
    const productIds = testProducts.map((product) => product.id);

    // create reviews
    const mockReviews = Array.from({ length: count }, () =>
      generateMockReview(productIds, userIds),
    );
    testReviews = await prisma.review.createManyAndReturn({
      data: mockReviews,
    });
  });

  afterEach(async () => {
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.usr.deleteMany({});
  });

  it("should return a 200 if the review exists", async () => {
    const id = testReviews[0].id;
    const req = new NextRequest(`http://localhost/api/review/${id}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: id.toString() } });

    expect(res.status).toBe(200);
  });

  it("should return a 400 if the id is invalid", async () => {
    const id = "acda2££";
    const req = new NextRequest(`http://localhost/api/review/${id}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: id.toString() } });

    expect(res.status).toBe(400);
  });

  it("should return a 500 if the review does not exist", async () => {
    const id = Math.max(...testReviews.map((review) => review.id)) + 1;
    const req = new NextRequest(`http://localhost/api/review/${id}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: id.toString() } });

    expect(res.status).toBe(500);
  });

  it("should delete the review", async () => {
    const id = testReviews[0].id;
    const req = new NextRequest(`http://localhost/api/review/${id}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: id.toString() } });

    const reviews = await prisma.review.findMany({ where: { id: id } });
    expect(reviews).toEqual([]);
  });
});
