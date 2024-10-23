import { Address, BasketItem, Category, Country, Currency, Order, OrderItem, Prisma, PrismaClient, Product, Review, Usr } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";


export type ModelType = 'address'
    | 'basketItem'
    | 'category'
    | 'country'
    | 'currency'
    | 'order'
    | 'orderItem'
    | 'product'
    | 'review'
    | 'usr';

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


export type FieldMetadata = {
    min: number;
    max: number;
}

export type Metadata<T extends ModelType> = {
    [K in keyof ModelMap[T]]?: FieldMetadata; } & {
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

// export type ResultType<T extends keyof ModelMap, I extends keyof IncludeMap[T]> = ModelMap[T] & (I extends undefined ? {} : { [K in I]: ModelMap[I]})

export type ResultType<T extends keyof ModelMap, I extends IncludeMap[T]> = ModelMap[T] & 
  (I extends undefined ? {} : { [K in keyof I]: I[K] extends true ? ModelMap[K] : ResultType<K, I[K]> });


export type TableMap = {
    address: keyof Prisma.AddressWhereInput,
    basketItem: keyof Prisma.BasketItemWhereInput,
    category: keyof Prisma.CategoryWhereInput,
    country: keyof Prisma.CountryWhereInput,
    currency: keyof Prisma.CurrencyWhereInput,
    order: keyof Prisma.OrderWhereInput,
    orderItem: keyof Prisma.OrderItemWhereInput,
    product: keyof Prisma.ProductWhereInput,
    review: keyof Prisma.ReviewWhereInput,
    usr: keyof Prisma.UsrWhereInput
};

export type IncludeMap = {
    address: Prisma.AddressInclude,
    basketItem: Prisma.BasketItemInclude,
    category: Prisma.CategoryInclude,
    country: Prisma.CountryInclude,
    currency: Prisma.CurrencyInclude,
    order: Prisma.OrderInclude,
    orderItem: Prisma.OrderItemInclude,
    product: Prisma.ProductInclude,
    review: Prisma.ReviewInclude,
    usr: Prisma.UsrInclude
};
