import { POST } from "@/app/api/user/by-email/route";
import prisma from "@/lib/prisma";
import { generateMockUser } from "@/tests/generate";
import { Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";

export const normaliseReviewDate = (review: Review) => {
  return { ...review, date: new Date(review.date).toISOString() };
};

describe("POST /api/user/by-email", () => {
  beforeAll(async () => {});

  afterEach(async () => {
    await prisma.usr.deleteMany({});
  });

  afterAll(async () => {});

  it("should return a 201 for a valid user", async () => {
    const user = generateMockUser();
    const userBasicData = {
      email: user.email,
      name: user.name,
      image: user.image_url,
    };
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(userBasicData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it("should create the user", async () => {
    const user = generateMockUser();
    const userBasicData = {
      email: user.email,
      name: user.name,
      image: user.image_url,
    };
    const req = new NextRequest(`http://localhost/api/user`, {
      method: "POST",
      body: JSON.stringify(userBasicData),
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
});
