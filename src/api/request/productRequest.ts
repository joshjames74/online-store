import { buildUrl } from "../helpers/utils";
import { ProductParams } from "../transformers/productSearchTransformer";
import { fetchData } from ".";
import {
  ProductsWithMetadata,
  ProductWithSeller,
} from "../services/productService.js";

// GET methods

export async function getProductById(
  id: number,
  cache?: RequestCache,
): Promise<ProductWithSeller> {
  return fetchData<ProductWithSeller>(`/api/product/${id}`, cache);
}

export async function getProductsBySearchParams(
  params: Partial<ProductParams>,
  cache?: RequestCache,
): Promise<ProductsWithMetadata> {
  const url = buildUrl("/api/product", params);
  return fetchData<ProductsWithMetadata>(url, cache);
}
