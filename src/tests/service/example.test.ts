/**
 * @jest-environment node
 */
import { GET } from "@/app/api/product/[id]/route";
import { NextRequest } from "next/server";
import { generateMockCountries, generateMockProducts } from "../generate";
import prisma from "../../../client";


beforeAll(async () => {
    console.log(process.env.DATABASE_URL);
    const products = generateMockCountries(10);
    await prisma.country.createMany({data : products});
    console.log(products[9]);
    console.log("10 products create successfully");
})

describe('GET /api/product/[id]', () => {
    console.log(process.env.NODE_ENV);
    it('should return a JSON response with a message', async () => {
        const req = new NextRequest('http://localhost/api/product/1', { method: "GET" });
        const res = await GET(req, { params : { id: "1" }});

        expect(res.status).toBe(200);
    });
})