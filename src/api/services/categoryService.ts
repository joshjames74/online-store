import { Category } from "@prisma/client";
import { getAllEntities, getOneEntityByFields } from "../helpers/dynamicQuery";

// GET functions

export function getCategoryById(id: number): Promise<Category | void> {
  return getOneEntityByFields({
    modelName: "category",
    whereQuery: { id: id },
  });
}

export function getAllCategories(): Promise<Category[] | void> {
  return getAllEntities("category", { name: "asc" });
}
