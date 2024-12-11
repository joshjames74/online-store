import { GET } from "@/app/api/user/by-email/[email]/route";
import prisma from "@/lib/prisma";
import { generateMockUser } from "@/tests/generate";
import { faker } from "@faker-js/faker";
import { Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";

export const normaliseReviewDate = (review: Review) => {
  return { ...review, date: new Date(review.date).toISOString() };
};

describe("GET /api/user/by-email/[email]", () => {
  let user: Usr;

  beforeAll(async () => {
    const users = Array.from({ length: 10 }, generateMockUser);
    const postedUsers = await prisma.usr.createManyAndReturn({
      data: users,
      include: { currency: true, country: true },
    });
    user = postedUsers[0];
  });

  afterAll(async () => {
    await prisma.usr.deleteMany({});
  });

  afterAll(async () => {});

  it("should return a 200 for a valid user", async () => {
    const req = new NextRequest(
      `http://localhost/api/user/by-email/${user.email}`,
      { method: "GET" },
    );
    const res = await GET(req, { params: { email: user.email } });

    expect(res.status).toBe(200);
  });

  it("should return the correct user", async () => {
    const req = new NextRequest(
      `http://localhost/api/user/by-email/${user.email}`,
      { method: "GET" },
    );
    const res = await GET(req, { params: { email: user.email } });
    const json: Usr = await res.json();

    expect(json).toEqual(user);
  });

  it("should return a 404 for a user that doesn't exist", async () => {
    // regenerate emails to be certain that a user with the email doesnt exist
    const users = await prisma.usr.findMany({});
    const emails = users.map((user) => user.email);
    let email = faker.internet.email();
    while (email in emails) {
      email = faker.internet.email();
    }

    const req = new NextRequest(`http://localhost/api/user/by-email/${email}`, {
      method: "GET",
    });
    const res = await GET(req, { params: { email: email } });

    expect(res.status).toEqual(404);
  });
});
