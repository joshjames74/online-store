/**
 * @jest-environment node
 */
import { GET } from "@/app/api/product/all/route";
import prisma from "@/lib/prisma";
import {
  generateMany,
  generateMockProduct,
  generateMockUser,
} from "@/tests/generate";
import { Product, Usr } from "@prisma/client";
import { NextRequest } from "next/server";

describe("GET /api/product/all", () => {
  let testProducts: Product[];
  let testUsers: Usr[];

  beforeAll(async () => {
    const count = 2;

    const mockUsers = generateMany<Usr>(count, generateMockUser);
    testUsers = await prisma.usr.createManyAndReturn({ data: mockUsers });
    const ids = testUsers.map((user) => user.id);

    const mockProducts = Array.from({ length: count }, () =>
      generateMockProduct(ids),
    );
    testProducts = await prisma.product.createManyAndReturn({
      data: mockProducts,
    });
  });

  afterAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.usr.deleteMany({});
  });

  it("should return a 200 if the products exist", async () => {
    const req = new NextRequest(`http://localhost/api/product/all`, {
      method: "GET",
    });
    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("should return the correct amount of products", async () => {
    const req = new NextRequest(`http://localhost/api/product/all`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(json.length).toBe(2);
  });

  it("should return the correct products", async () => {
    const req = new NextRequest(`http://localhost/api/product/all`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(json.sort()).toEqual(testProducts.sort());
  });
});
