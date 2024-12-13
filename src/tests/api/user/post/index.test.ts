/**
 * @jest-environment node
 */
import { POST } from "@/app/api/user/route";
import prisma from "@/lib/prisma";
import { generateMockUser } from "@/tests/generate";
import { Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";

export const normaliseReviewDate = (review: Review) => {
  return { ...review, date: new Date(review.date).toISOString() };
};

describe("POST /api/user/", () => {
  beforeAll(async () => {});

  afterEach(async () => {
    await prisma.usr.deleteMany({});
  });

  afterAll(async () => {});

  it("should return a 201 for a valid user", async () => {
    const user = generateMockUser();
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it("should create the user", async () => {
    const user = generateMockUser();
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);
    const postedUser = await prisma.usr.findFirst({});

    expect(postedUser).not.toBeNull();
    expect({ ...user, id: postedUser?.id || 0 }).toEqual(
      postedUser || ({} as Usr),
    );
  });

  it("should return a 500 for an invalid country id", async () => {
    const user = generateMockUser();
    user.countryId = 1;
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it("should return a 500 for an invalid currency id", async () => {
    const user = generateMockUser();
    user.countryId = 1;
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
