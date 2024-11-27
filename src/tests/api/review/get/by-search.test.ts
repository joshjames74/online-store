/**
 * @jest-environment node
 */
import { GET } from "@/app/api/review/route";
import prisma from "@/lib/prisma";
import { generateMany, generateMockProduct, generateMockReview, generateMockUser } from "@/tests/generate";
import { Product, Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";


export const normaliseReviewDate = (review: Review) => {
    return { ...review, date: new Date(review.date).toISOString() }
}


describe('GET /api/review ', () => {

    let testProducts: Product[];
    let testUsers: Usr[];
    let testReviews: Review[];

    beforeAll(async () => {
        const count = 2;
        
        // create users
        const mockUsers = generateMany<Usr>(count, generateMockUser);
        testUsers = await prisma.usr.createManyAndReturn({ data: mockUsers });
        const userIds = testUsers.map(user => user.id);
    
        // create products
        const mockProducts = Array.from({ length: count }, () => generateMockProduct(userIds));
        testProducts = await prisma.product.createManyAndReturn({ data: mockProducts });
        const productIds = testProducts.map(product => product.id);

        // create reviews
        const mockReviews = Array.from({ length: count }, () => generateMockReview(productIds, userIds));
        testReviews = await prisma.review.createManyAndReturn({ data: mockReviews, include: { usr: true } });
    });
    
    afterAll(async () => {
        await prisma.review.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.usr.deleteMany({});
    });

    // no args

    it('no args: should return a 200', async () => {
        const req = new NextRequest(`http://localhost/api/review`, { method: "GET" });
        const res = await GET(req);

        expect(res.status).toBe(200);
    });

    it('no args: should return an array', async () => {
        const req = new NextRequest(`http://localhost/api/review`, { method: "GET" });
        const res = await GET(req);
        const json = await res.json();

        expect(Array.isArray(json)).toBe(true);
    });

    it('no args: should return all reviews', async () => {
        const req = new NextRequest(`http://localhost/api/review`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();
        const normalisedReviews = json.map((review) => normaliseReviewDate(review));

        expect(normalisedReviews).toEqual(testReviews.map((review) => normaliseReviewDate(review)));
    });

    // score tests

    it('score: should return no reviews when score > 5', async () => {
        const score = 6;

        const req = new NextRequest(`http://localhost/api/review?score=${score}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        expect(json).toEqual([]);
    });

    it('score: should return no reviews when score < 0', async () => {
        const score = -1;

        const req = new NextRequest(`http://localhost/api/review?score=${score}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        expect(json).toEqual([]);
    });

    // review filter tests

    it('filter: should return all products ', async () => {
        const filter = 1;

        const req = new NextRequest(`http://localhost/api/review?review_filter=${filter}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        expect(json.length).toEqual(2);
    });

    it('filter: should return score low to high when arg is 1 ', async () => {
        const filter = 1;

        const req = new NextRequest(`http://localhost/api/review?review_filter=${filter}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        const sorted = json.sort((a, b) => a.score - b.score);

        expect(json).toEqual(sorted);
    });

    it('filter: should return score high to low when arg is 2', async () => {
        const filter = 2;

        const req = new NextRequest(`http://localhost/api/review?review_filter=${filter}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        const sorted = json.sort((a, b) => b.score - a.score);

        expect(json).toEqual(sorted);
    });

    it('filter: should return date new to old when arg is 3', async () => {
        const filter = 3;

        const req = new NextRequest(`http://localhost/api/review?review_filter=${filter}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        const sorted = json.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        expect(json).toEqual(sorted);
    });

    it('filter: should return date old to new when arg is 4', async () => {
        const filter = 4;

        const req = new NextRequest(`http://localhost/api/review?review_filter=${filter}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        const sorted = json.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        expect(json).toEqual(sorted);
    });

    // productId tests

    it('productId: should return products for correct productId', async () => {
        const productId = testReviews[0].id;

        const req = new NextRequest(`http://localhost/api/review?productId=${productId}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        const reduced = json.filter(review => review.productId ==- productId);

        expect(reduced.length).toEqual(json.length);
    });

    it('productId: should return no products for incorrect productId', async () => {
        const productId = Math.max(...testReviews.map(review => review.id)) + 1;

        const req = new NextRequest(`http://localhost/api/review?productId=${productId}`, { method: "GET" });
        const res = await GET(req);
        const json: Review[] = await res.json();

        expect(json).toEqual([]);
    });

})