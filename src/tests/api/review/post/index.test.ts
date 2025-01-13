/**
 * @jest-environment node
 */
import { POST } from "@/app/api/review/route";
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

describe("POST /api/review/", () => {
  let testProducts: Product[];
  let testUsers: Usr[];

  beforeAll(async () => {
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
  });

  afterEach(async () => {
    await prisma.review.deleteMany({});
  });

  afterAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.usr.deleteMany({});
  });

  it("should return a 201 for a valid review", async () => {
    const productIds = testProducts.map((product) => product.id);
    const usrIds = testUsers.map((user) => user.id);
    const review = generateMockReview(productIds, usrIds);
    const req = new NextRequest(`http://localhost/api/review`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it("should return a 500 for an invalid review", async () => {
    const review = {};
    const req = new NextRequest(`http://localhost/api/review`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it("should create the review", async () => {
    const productIds = testProducts.map((product) => product.id);
    const usrIds = testUsers.map((user) => user.id);
    const review = generateMockReview(productIds, usrIds);
    const req = new NextRequest(`http://localhost/api/review`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);
    const postedReview = await prisma.review.findFirst({});

    expect(postedReview).not.toBeNull();
    expect(
      normaliseReviewDate({ ...review, id: postedReview?.id || "" }),
    ).toEqual(normaliseReviewDate(postedReview || ({} as Review)));
  });
});
