import { QueryParams } from "@/redux/reducers/product";
import { Product } from "@prisma/client";
import axios from "axios";
import { ManyWithMetadata, ModelsResponse, ResultType } from "../helpers/types";
import { buildUrl } from "../helpers/utils";
import { ProductParams } from "../transformers/productSearchTransformer";
import { fetchData } from ".";

// GET methods

export async function getProductById(
  id: number,
  cache?: RequestCache,
): Promise<ResultType<"product", { seller: true }>> {
  return fetchData<ResultType<"product", { seller: true }>>(
    `/api/product/${id}`,
    cache,
  );
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchData<Product[]>(`/api/product/all`, "force-cache");
}

export async function getProductsBySearchParams(
  params: Partial<ProductParams>,
  cache?: RequestCache,
): Promise<ManyWithMetadata<"product", { seller: true }>> {
  const url = buildUrl("/api/product", params);
  return fetchData<ManyWithMetadata<"product", { seller: true }>>(url, cache);
}
