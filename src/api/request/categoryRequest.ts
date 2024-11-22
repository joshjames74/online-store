import { Category } from "@prisma/client";
import { fetchData } from ".";

export async function getAllCategories(
  cache?: RequestCache,
): Promise<Category[]> {
  return fetchData<Category[]>("/api/category/all", cache);
}
