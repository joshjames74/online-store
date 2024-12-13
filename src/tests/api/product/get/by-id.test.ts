/**
 * @jest-environment node
 */
import { GET } from "@/app/api/product/[id]/route";
import { NextRequest } from "next/server";
import {
  generateMany,
  generateMockCountries,
  generateMockProduct,
  generateMockProducts,
  generateMockUser,
} from "../../../generate";
import { Product, Usr } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ResultType } from "@/api/helpers/types";

describe("GET /api/product/[id]", () => {
  let testProducts: ResultType<"product", { seller: true }>[];
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
      include: { seller: true },
    });
  });

  afterAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.usr.deleteMany({});
  });

  it("should return a 200 if the product exists", async () => {
    const product = testProducts[0];
    const req = new NextRequest(`http://localhost/api/product/${product}`, {
      method: "GET",
    });
    const res = await GET(req, { params: { id: product.id.toString() } });

    expect(res.status).toBe(200);
  });

  it("should return a 404 if the product does not exist", async () => {
    const req = new NextRequest("http://localhost/api/product/0", {
      method: "GET",
    });
    const res = await GET(req, { params: { id: "0" } });

    expect(res.status).toBe(404);
  });

  it("should return a 400 for invalid product id", async () => {
    const req = new NextRequest("http://localhost/api/product/abc£", {
      method: "GET",
    });
    const res = await GET(req, { params: { id: "abc£" } });

    expect(res.status).toBe(400);
  });

  it("should return the correct product data", async () => {
    const product = testProducts[0];
    const req = new NextRequest(`ttp://localhost/api/product/${product.id}`, {
      method: "GET",
    });
    const res = await GET(req, { params: { id: product.id.toString() } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(product);
  });
});
