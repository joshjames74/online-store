import prisma from "@/lib/prisma";
import {
  generateMany,
  generateMockProduct,
  generateMockUser,
} from "@/tests/generate";
import { Product, Usr } from "@prisma/client";
import { NextRequest } from "next/server";
import { faker } from "@faker-js/faker";
import { GET } from "@/app/api/product/route";

describe("GET /api/product", () => {
  let testProducts: Product[];
  let testUsers: Usr[];

  beforeAll(async () => {
    const count = 10;

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

  it("no args: should return a 200", async () => {
    const req = new NextRequest(`http://localhost/api/product`, {
      method: "GET",
    });
    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("no args: should return the correct type", async () => {
    const req = new NextRequest(`http://localhost/api/product`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(Number.isInteger(json.metadata.count)).toBe(true);
    expect(isNaN(json.metadata.price.min)).toBe(false);
    expect(isNaN(json.metadata.price.max)).toBe(false);
  });

  it("no args: should include the correct product count", async () => {
    const req = new NextRequest(`http://localhost/api/product`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.metadata.count).toEqual(testProducts.length);
  });

  it("no args: should include the correct max price", async () => {
    const req = new NextRequest(`http://localhost/api/product`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.metadata.price.max).toEqual(
      Math.max(...testProducts.map((product) => product.price)),
    );
  });

  // query tests

  it("query: should return all products if an empty query is passed", async () => {
    const req = new NextRequest(`http://localhost/api/product?query=`, {
      method: "GET",
    });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual(testProducts);
  });

  it("query: should return no products if the query does not match a product title or description", async () => {
    // generate a query that does not match

    let randomString: string = "";
    let doesMatch: boolean = true;

    while (doesMatch) {
      randomString = faker.commerce.product().toLowerCase();
      doesMatch = false;
      for (const product of testProducts) {
        if (
          product.title.toLowerCase().includes(randomString) ||
          product.description.toLowerCase().includes(randomString)
        ) {
          doesMatch = true;
          break;
        }
      }
    }

    const req = new NextRequest(
      `http://localhost/api/product?query=${randomString}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  // max price tests

  it("max price: should return no products if max price exceeds min price of products", async () => {
    const minPrice =
      Math.min(...testProducts.map((product) => product.price)) - 1;

    const req = new NextRequest(
      `http://localhost/api/product?max_price=${minPrice}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  it("max price: should return all products if max price is gte the max price of the products", async () => {
    const maxPrice = Math.max(...testProducts.map((product) => product.price));

    const req = new NextRequest(
      `http://localhost/api/product?max_price=${maxPrice}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual(testProducts);
  });

  it("max price: should return no products if the max price is less than 0", async () => {
    const maxPrice = -1;

    const req = new NextRequest(
      `http://localhost/api/product?max_price=${maxPrice}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  // min review tests

  it("min review: should return no products if min review exceeds max review score of products", async () => {
    const minReview =
      Math.max(...testProducts.map((product) => product.review_score)) + 1;

    const req = new NextRequest(
      `http://localhost/api/product?min_review=${minReview}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  it("min review: should return all products if min review is lte the min review of the products", async () => {
    const minReview = Math.min(
      ...testProducts.map((product) => product.review_score),
    );

    const req = new NextRequest(
      `http://localhost/api/product?min_review=${minReview}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual(testProducts);
  });

  it("min review: should return no products if the min review is greater than 5", async () => {
    const minReview = 6;

    const req = new NextRequest(
      `http://localhost/api/product?min_review=${minReview}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  // per page tests

  it("per page: should return all products if per page gte the number of products", async () => {
    const perPage = testProducts.length;

    const req = new NextRequest(
      `http://localhost/api/product?perPage=${perPage}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual(testProducts);
  });

  it("per page: should return no products if per page is zero", async () => {
    const perPage = 0;

    const req = new NextRequest(
      `http://localhost/api/product?perPage=${perPage}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  it("per page: should return no products if per page is less than 0", async () => {
    const perPage = -1;

    const req = new NextRequest(
      `http://localhost/api/product?perPage=${perPage}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
    expect(json.metadata.count).toEqual(0);
    expect(json.metadata.price.min).toEqual(0);
    expect(json.metadata.price.max).toEqual(0);
  });

  it("per page: should return 1 products if per page is 1", async () => {
    const perPage = 1;

    const req = new NextRequest(
      `http://localhost/api/product?perPage=${perPage}`,
      { method: "GET" },
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.length).toEqual(1);
    expect(json.metadata.count).toEqual(1);
  });
});
