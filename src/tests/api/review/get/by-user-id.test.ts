/**
 * @jest-environment node
 */
import { GET } from "@/app/api/user/[id]/reviews/route";
import prisma from "@/lib/prisma";
import { generateMany, generateMockProduct, generateMockReview, generateMockUser } from "@/tests/generate";
import { es } from "@faker-js/faker";
import { Product, Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";


export const normaliseReviewDate = (review: Review) => {
    return { ...review, date: new Date(review.date).toISOString() }
}


describe('GET /api/user/[id]/reviews', () => {

    let testProducts: Product[];
    let testUsers: Usr[];
    let testReviews: Review[];
    let activeUser: Usr;

    beforeAll(async () => {
        const count = 2;
        
        // create users
        const mockUsers = generateMany<Usr>(count, generateMockUser);
        testUsers = await prisma.usr.createManyAndReturn({ data: mockUsers });
        const userIds = testUsers.map(user => user.id);
        
        // chosen user
        activeUser = testUsers[0];
    
        // create products
        const mockProducts = Array.from({ length: count }, () => generateMockProduct(userIds));
        testProducts = await prisma.product.createManyAndReturn({ data: mockProducts });
        const productIds = testProducts.map(product => product.id);

        // create reviews
        const mockReviews = Array.from({ length: count }, () => generateMockReview(productIds, [activeUser.id]));
        testReviews = await prisma.review.createManyAndReturn({ data: mockReviews });
    });
    
    afterAll(async () => {
        await prisma.review.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.usr.deleteMany({});
    });

    it('should return a 200 if the user exists', async () => {
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/reviews`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});

        expect(res.status).toBe(200);
    });

    it('should return no reviews if the user does not exist', async () => {
        const userId = Math.max(...testUsers.map(user => user.id)) + 1;
        const req = new NextRequest(`http://localhost/api/user/${userId}/reviews`, { method: "GET" });
        const res = await GET(req, { params: { id: userId.toString() }});
        const json = await res.json();

        expect(json).toEqual([]);
    });

    it('should return a 400 if the user id is invalid', async () => {
        const userId = "$"
        const req = new NextRequest(`http://localhost/api/user/${userId}/reviews`, { method: "GET" });
        const res = await GET(req, { params: { id: userId.toString() }});

        expect(res.status).toBe(400);
    });

    it('should return reviews with the correct userId', async () => {
        
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/reviews`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});
        const json: Review[] = await res.json();

        const userIds = json.map(review => review.usrId);
        const validUserIds = userIds.filter(id => id === activeUser.id);

        expect(res.status).toBe(200);
        expect(userIds.length).toEqual(2);
        expect(validUserIds.length).toEqual(userIds.length);
    });

    it('should return the correct reviews', async () => {
        
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/reviews`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});
        const json: Review[] = await res.json();

        const reviews = json.map(review => normaliseReviewDate(review));

        expect(res.status).toBe(200);
        expect(reviews).toEqual(testReviews.map(review => normaliseReviewDate(review)));
    });
});