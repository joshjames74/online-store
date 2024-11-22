/**
 * @jest-environment node
 */
import { GET } from "@/app/api/product/[id]/route";
import { NextRequest } from "next/server";

describe('GET /api/product/[id]', () => {
    it('should return a JSON response with a message', async () => {
        const req = new NextRequest('http://localhost/api/product/1', { method: "GET" });
        const res = await GET(req, { params : { id: "1" }});

        expect(res.status).toBe(200);
    });
})