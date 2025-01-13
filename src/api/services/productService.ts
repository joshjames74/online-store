import { Product } from "@prisma/client";
import { getSkipTakeFromPage } from "../transformers";
import {
  ProductFilter,
  ProductParams,
} from "../transformers/productSearchTransformer";
import { ManyWithMetadata, ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

// types

export type ProductWithSeller = ResultType<"product", { seller: true }>;
export type ProductsWithMetadata = ManyWithMetadata<
  "product",
  { seller: true }
>;

// helpers

export function getProductFilterOrder(
  product_filter: ProductFilter,
): "asc" | "desc" {
  switch (product_filter) {
    case ProductFilter.PRICE_HIGH_TO_LOW:
      return "desc";
    case ProductFilter.PRICE_LOW_TO_HIGH:
      return "asc";
    default:
      return "asc";
  }
}

export function getProductFilterColumn(product_filter: ProductFilter): "price" | "" {
  switch (product_filter) {
    case ProductFilter.PRICE_HIGH_TO_LOW:
      return "price";
    case ProductFilter.PRICE_LOW_TO_HIGH:
      return "price";
    default:
      return "";
  }
}

export function createWhereQuery(params: Partial<ProductParams>) {
  const whereQuery: any = {};

  if (params.query) {
    whereQuery.OR = [
      {
        title: {
          contains: params.query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: params.query,
          mode: "insensitive",
        },
      },
    ];
  }

  if (params.categories?.length) {
    whereQuery.categories = {
      some: {
        categoryId: {
          in: params.categories,
        },
      },
    };
  }

  if (params.max_price) {
    whereQuery.price = {
      lte: params.max_price,
    };
  }

  if (params.min_review) {
    whereQuery.review_score = {
      gte: params.min_review,
    };
  }

  return whereQuery;
}

export function createOrderByQuery(params: Partial<ProductParams>) {
  const orderQuery: any = {};

  if (params.product_filter) {
    const order = getProductFilterOrder(params.product_filter);
    const column = getProductFilterColumn(params.product_filter);
    Object.assign(orderQuery, { [column]: order });
  }

  return orderQuery;
}

// GET methods

export async function getProductById(
  id: number,
): Promise<ProductWithSeller | null> {
  return prisma.product.findFirst({
    where: { id: id },
    include: { seller: true },
  });
}

export async function getProductsByUserId(
  id: string,
): Promise<ProductWithSeller[] | void> {
  return prisma.product.findMany({
    where: { sellerId: id },
    include: { seller: true },
  });
}

export async function getProductBySearch(
  params: Partial<ProductParams>,
): Promise<ProductsWithMetadata | void> {
  const whereQuery = createWhereQuery(params);
  const orderQuery = createOrderByQuery(params);
  const { skip, take } = getSkipTakeFromPage(params.perPage, params.pageNumber);

  const query = {
    where: whereQuery,
    orderBy: orderQuery,
    include: {
      seller: true,
    },
  };

  if (skip) {
    Object.assign(query, { skip: skip });
  }

  if (take) {
    Object.assign(query, { take: take });
  }

  const products = await prisma.product.findMany(query);

  const metadata = await prisma.product.aggregate({
    where: whereQuery,
    _count: {
      id: true,
    },
    _max: {
      price: true,
    },
  });

  const response: ProductsWithMetadata = {
    data: products || [],
    metadata: {
      count: metadata._count.id || 0,
      price: {
        max: metadata._max.price || 0,
        min: 0,
      },
    },
  };

  return response;
}

// POST methods

export async function postProduct(
  product: Omit<Product, "product_id">,
): Promise<Product | void> {
  return await prisma.product.create({
    data: product,
  });
}

// DELETE methods

export async function deleteProductById(id: number): Promise<Product | void> {
  return await prisma.product.delete({
    where: { id: id },
  });
}
