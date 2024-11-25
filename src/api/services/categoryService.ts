import { Category } from "@prisma/client";
import { getAllEntity, getOneEntityByField } from "../helpers/dynamicQuery";

// GET functions

export function getCategoryById(id: number): Promise<Category | void> {
  return getOneEntityByField("category", "id", id);
}

export function getAllCategories(): Promise<Category[] | void> {
  return getAllEntity("category", { "name": "asc" });
}
