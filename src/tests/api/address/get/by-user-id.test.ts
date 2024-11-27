/**
 * @jest-environment node
 */
import { GET } from "@/app/api/user/[id]/addresses/route";
import prisma from "@/lib/prisma";
import { generateMany, generateMockAddress, generateMockCountry, generateMockProduct, generateMockReview, generateMockUser } from "@/tests/generate";
import { Address, Country, Product, Review, Usr } from "@prisma/client";
import { NextRequest } from "next/server";


export const normaliseReviewDate = (review: Review) => {
    return { ...review, date: new Date(review.date).toISOString() }
}


describe('GET /api/user/[id]/addresses', () => {

    let testAddresses: Address[];
    let testUsers: Usr[];
    let activeUser: Usr;

    beforeAll(async () => {
        const count = 2;
        
        // create users
        const mockUsers = generateMany<Usr>(count, generateMockUser);
        testUsers = await prisma.usr.createManyAndReturn({ data: mockUsers });

        // create countries
        const mockCountries = generateMany<Country>(count, generateMockCountry);
        const testCountries = await prisma.country.createManyAndReturn({ data: mockCountries });
        const countryIds = testCountries.map(country => country.id);
        
        // chosen user
        activeUser = testUsers[0];
    
        // create products
        const mockAddresses = Array.from({ length: count }, () => generateMockAddress([activeUser.id], countryIds));
        testAddresses = await prisma.address.createManyAndReturn({ data: mockAddresses, include: { country: true } });
    });
    
    afterAll(async () => {
        await prisma.address.deleteMany({});
        await prisma.usr.deleteMany({});
    });

    it('should return a 200 if the user exists', async () => {
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/addresses`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});

        expect(res.status).toBe(200);
    });

    it('should return no addresses if the user does not exist', async () => {
        const userId = Math.max(...testUsers.map(user => user.id)) + 1;
        const req = new NextRequest(`http://localhost/api/user/${userId}/addresses`, { method: "GET" });
        const res = await GET(req, { params: { id: userId.toString() }});
        const json = await res.json();

        expect(json).toEqual([]);
    });

    it('should return a 400 if the user id is invalid', async () => {
        const userId = "$"
        const req = new NextRequest(`http://localhost/api/user/${userId}/addresses`, { method: "GET" });
        const res = await GET(req, { params: { id: userId.toString() }});

        expect(res.status).toBe(400);
    });

    it('should return addresses with the correct userId', async () => {
        
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/addresses`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});
        const json: Address[] = await res.json();

        const userIds = json.map(address => address.usrId);
        const validUserIds = userIds.filter(id => id === activeUser.id);

        expect(res.status).toBe(200);
        expect(userIds.length).toEqual(2);
        expect(validUserIds.length).toEqual(userIds.length);
    });

    it('should return the correct addresses', async () => {
        
        const req = new NextRequest(`http://localhost/api/user/${activeUser.id}/addresses`, { method: "GET" });
        const res = await GET(req, { params: { id: activeUser.id.toString() }});
        const json: Address[] = await res.json();


        expect(res.status).toBe(200);
        expect(json).toEqual(testAddresses);
    });
});