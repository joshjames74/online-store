import { Category } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function getAllCategories(): Promise<Category[]> {
    console.log("Called all categories once");
    const response = await fetch("/api/category/all", {
        method: "GET",
        cache: "force-cache"
    });
    if (!response.ok) {
        throw new Error('Error fetching all categories');
    }
    return response.json();
}