import prisma from "@/lib/prisma";
import {
  Address,
  BasketItem,
  Category,
  Country,
  Currency,
  Order,
  OrderItem,
  Prisma,
  PrismaClient,
  Product,
  Review,
  Usr,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type ModelType =
  | "address"
  | "basketItem"
  | "category"
  | "country"
  | "currency"
  | "order"
  | "orderItem"
  | "product"
  | "review"
  | "usr";

export type ModelMap = {
  address: Address;
  basketItem: BasketItem;
  category: Category;
  country: Country;
  currency: Currency;
  order: Order;
  orderItem: OrderItem;
  product: Product;
  review: Review;
  usr: Usr;
};

export type PrismaMapType = {
  [K in keyof ModelMap]: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs
  >[K];
};

export const PrismaMap: PrismaMapType = {
  address: prisma.address,
  basketItem: prisma.basketItem,
  category: prisma.category,
  country: prisma.country,
  currency: prisma.currency,
  order: prisma.order,
  orderItem: prisma.orderItem,
  product: prisma.product,
  review: prisma.review,
  usr: prisma.usr,
};

// define relationships ----------

export enum Relationship {
  ONE_TO_ONE = "one-to-one",
  ONE_TO_MANY = "one-to-many",
  MANY_TO_ONE = "many-to-one",
  MANY_TO_MANY = "many-to-many",
}

export type RelationshipMapType = {
  [K in keyof ModelMap]?: {
    [P in keyof ModelMap]?: Relationship;
  };
};

export const RelationshipMap: RelationshipMapType = {
  order: { orderItem: Relationship.ONE_TO_MANY },
  //orderItem: { order: Relationship.MANY_TO_ONE },
};

export function getRelationshipType(
  model: keyof ModelMap,
  subModel: keyof ModelMap,
): Relationship | void {
  if (RelationshipMap[model]?.[subModel]) {
    return RelationshipMap[model][subModel];
  }
  return;
}

export type GetRelationshipType<
  M extends keyof ModelMap,
  S extends keyof ModelMap,
> = M extends keyof RelationshipMapType
  ? S extends keyof RelationshipMapType[M]
    ? RelationshipMapType[M][S]
    : never
  : never;

// define aliases -----------

export type AliasMap = {
  seller: Usr;
};

// define metadata ------------

export type FieldMetadata = {
  min: number;
  max: number;
};

export type Metadata<T extends ModelType> = {
  [K in keyof ModelMap[T]]?: FieldMetadata;
} & {
  count?: number;
};

export type ModelResponse<T extends ModelType> = {
  data: ModelMap[T];
  metadata?: Metadata<T>;
};

export type ModelsResponse<T extends ModelType> = {
  data: ModelMap[T][];
  metadata: Metadata<T>;
};

export type OneWithMetadata<T extends ModelType, I extends IncludeMap[T]> = {
  data: ModelMap[T] | ResultType<T, I>;
  metadata: Metadata<T>;
};

export type ManyWithMetadata<T extends ModelType, I extends IncludeMap[T]> = {
  data: ResultType<T, I>[];
  metadata: Metadata<T>;
};

// build types ---------------

// remove the parent include from an inclusion relation
export type ExtractInclude<I, K> = K extends keyof I
  ? I[K] extends { include: infer U }
    ? K extends keyof IncludeMap
      ? U extends IncludeMap[K]
        ? U
        : never
      : never
    : never
  : never;

export type ResultType<
  T extends keyof ModelMap,
  I extends IncludeMap[T],
> = ModelMap[T] &
  (I extends undefined
    ? never
    : {
        // iterate include relations
        [K in keyof I]: K extends keyof ModelMap // check validity
          ? // if we have { modelName: true } then stop and return the modelName
            I[K] extends true
            ? ModelMap[K]
            : // check that we have a correct sub-relation
              ExtractInclude<I, K> extends never
              ? never
              : // if recursive, check if many-to-one relationship exists
                //GetRelationshipType<T, K> extends RelationshipMap
                T extends "order"
                ? K extends "orderItem"
                  ? ResultType<K, ExtractInclude<I, K>>[]
                  : ResultType<K, ExtractInclude<I, K>>
                : ResultType<K, ExtractInclude<I, K>>
          : // check if it's an alias, for instance, seller is an alias of user
            K extends keyof AliasMap
            ? AliasMap[K]
            : never;
      });

export type TableMap = {
  address: keyof Prisma.AddressWhereInput;
  basketItem: keyof Prisma.BasketItemWhereInput;
  category: keyof Prisma.CategoryWhereInput;
  country: keyof Prisma.CountryWhereInput;
  currency: keyof Prisma.CurrencyWhereInput;
  order: keyof Prisma.OrderWhereInput;
  orderItem: keyof Prisma.OrderItemWhereInput;
  product: keyof Prisma.ProductWhereInput;
  review: keyof Prisma.ReviewWhereInput;
  usr: keyof Prisma.UsrWhereInput;
};

export type IncludeMap = {
  address: Prisma.AddressInclude;
  basketItem: Prisma.BasketItemInclude;
  category: Prisma.CategoryInclude;
  country: Prisma.CountryInclude;
  currency: Prisma.CurrencyInclude;
  order: Prisma.OrderInclude;
  orderItem: Prisma.OrderItemInclude;
  product: Prisma.ProductInclude;
  review: Prisma.ReviewInclude;
  usr: Prisma.UsrInclude;
};
