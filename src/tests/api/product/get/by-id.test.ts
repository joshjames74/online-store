/**
 * @jest-environment node
 */
import { GET } from "@/app/api/product/[id]/route";
import { NextRequest } from "next/server";
import { getRandomElement } from "../../../generate";
import { Product, Usr } from "@prisma/client";
import { ProductWithSeller } from "@/api/services/productService";
import Seed, { SeedConfig } from "@/prisma/seed";


const config: SeedConfig = {
  userCount: 2,
  productCount: 10,
  reviewCount: 2,
  orderCount: 2,
  orderItemCount: 2,
  basketItemCount: 2,
  productCategoriesCount: 2,
  addressCount: 2,
};


describe("GET /api/product/[id]", () => {

  const seed: Seed = new Seed(config);
  let testProducts: ProductWithSeller[];
  let testUsers: Usr[];
  const baseUrl: string = "http://localhost:3000";


  beforeAll(async () => {

    await seed.seedUsers();
    await seed.seedProducts();

    testProducts = await seed.getProductsWithSellers();
    testUsers = await seed.getUsers();

  });


  afterAll(async () => {

    await seed.deleteProducts();
    await seed.deleteUsrs();

  });


  it("should return a 200 if the product exists", async () => {

    const product: ProductWithSeller = getRandomElement(testProducts);

    console.log("\nProduct: ")
    console.log(product);
    
    const req = new NextRequest(
      `${baseUrl}/api/product/${product.id}`, 
      { method: "GET", }
    );
    const res = await GET(req, { params: { id: product.id.toString() } });

    const json = await res.json();
    console.log("\nProduct json:")
    console.log(json);

    expect(res.status).toBe(200);

  });


  it("should return a 404 if the product does not exist", async () => {

    const nullProductId: number = 0
    const req = new NextRequest(
      `http://localhost/api/product/${nullProductId}`, 
      { method: "GET", }
    );
    const res = await GET(req, { params: { id: nullProductId.toString() } });

    expect(res.status).toBe(404);

  });


  it("should return a 400 for invalid product id", async () => {

    const invalidProductId: string = "abc£";
    const req = new NextRequest(
      `http://localhost/api/product/${invalidProductId}`, 
      { method: "GET" }
    );
    const res = await GET(req, { params: { id: invalidProductId } });

    expect(res.status).toBe(400);

  });


  it("should return the correct product data", async () => {

    const product = getRandomElement(testProducts);
    const req = new NextRequest(
      `http://localhost/api/product/${product.id}`, 
      { method: "GET" }
    );
    const res = await GET(req, { params: { id: product.id.toString() } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(product);

  });


});
