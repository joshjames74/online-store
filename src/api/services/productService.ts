import { Product } from "@prisma/client";
import {
  deleteOneEntityByField,
  getAllEntity,
  getEntitiesByField,
  getEntitiesByFields,
  getOneEntityByField,
  postOneEntity,
  putOneEntityByField,
} from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { queryParamsToPrismaQuery } from "../transformers";
import {
  ProductParams,
  productQueryTransformer,
} from "../transformers/productSearchTransformer";
import { ManyWithMetadata, Metadata, ResultType } from "../helpers/types.js";

// GET methods

export async function getProductById(
  id: number,
): Promise<ResultType<"product", { seller: true }> | void> {
  return getOneEntityByField({
    modelName: "product",
    whereQuery: { id: id },
    include: { seller: true },
  });
}

export async function getProductsByUserId(
  id: number,
): Promise<ResultType<"product", { seller: true }>[] | void> {
  return getEntitiesByField({
    modelName: "product",
    whereQuery: { sellerId: id },
    include: { seller: true },
  });
}

// to do: delete
export async function getAllProducts(): Promise<Product[] | void> {
  return getAllEntity("product");
}

export async function getProductBySearch(
  params: Partial<ProductParams>,
): Promise<ManyWithMetadata<"product", { seller: true }> | void> {
  // convert parameters to query objects
  const { whereQuery, orderQuery, skip, take } = queryParamsToPrismaQuery(
    params,
    productQueryTransformer,
  );

  // fetch products
  const products = await getEntitiesByFields({
    modelName: "product",
    whereQuery: whereQuery,
    orderQuery: orderQuery,
    skip: skip,
    take: take,
    include: { seller: true },
  });

  // get metadata
  const count = products?.length;
  const max_price = Math.max(
    ...(products?.length ? products?.map((product) => product.price) : [0]),
  );

  const metadata: Metadata<"product"> = {
    count: count,
    price: { max: max_price, min: 0 },
  };

  const response: ManyWithMetadata<"product", { seller: true }> = {
    data: products || [],
    metadata: metadata,
  };

  return response;
}

// POST methods

export async function postProduct(
  product: Omit<Product, "product_id">,
): Promise<Product | void> {
  return postOneEntity("product", product);
}

// DELETE methods

export async function deleteProductById(id: number): Promise<Product | void> {
  return deleteOneEntityByField("product", "id", id);
}

// PUT methods

export async function putProductByFields(
  searchFields: FieldValuePair<"product">,
  putFields: FieldValuePair<"product">[],
): Promise<Product | void> {
  return await putOneEntityByField("product", searchFields, putFields);
}
