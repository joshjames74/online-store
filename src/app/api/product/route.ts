import { getHelper, postHelper } from "@/api/helpers/request";
import { parseQueryParams } from "@/api/helpers/utils";
import { getProductBySearch, postProduct } from "@/api/services/productService";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";
import { QueryParams } from "@/redux/reducers/product";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET request

export async function GET(req: NextRequest): Promise<NextResponse> {
  // to do: new function to do the parsing

  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "";
  const max_price = parseFloat(searchParams.get("max_price") || "0");
  const min_review = parseFloat(searchParams.get("min_review") || "0");

  const perPage = parseInt(searchParams.get("perPage") || "");
  const pageNumber = parseInt(searchParams.get("pageNumber") || "");

  const categories = searchParams.getAll("categories[]").length
    ? searchParams
        .getAll("categories[]")
        .filter((val) => !isNaN(parseInt(val)))
        .map((val) => parseInt(val))
    : [];

  // parse enum
  const product_filter_raw = parseInt(searchParams.get("product_filter") || "");
  let product_filter: ProductFilter;

  if (
    product_filter_raw &&
    Object.values(ProductFilter).includes(product_filter_raw as ProductFilter)
  ) {
    product_filter = product_filter_raw as ProductFilter;
  }

  const params = {
    query,
    max_price,
    min_review,
    categories,
    product_filter,
    perPage,
    pageNumber,
  };

  return getHelper(getProductBySearch, params);
}

// POST request

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const product: Omit<Product, "product_id"> = body;

  return await postHelper("product", postProduct, product);
}
