import { Category } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function getAllCategories(
  cache?: RequestCache,
): Promise<Category[]> {
  const response = await fetch("/api/category/all", {
    method: "GET",
    cache: cache ? cache : "force-cache",
  });
  if (!response.ok) {
    throw new Error("Error fetching all categories");
  }
  return response.json();
}
