import { Address, BasketItem, Category, Country, Currency, Order, OrderItem, Prisma, Product, Review, Usr } from "@prisma/client";


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
    metadata?: Metadata<T>;
};


// export type TableMap2 = {
//     address: 'id' | 'usrId' | 'name' | 'number' | 'street_name' | 'postcode' | 'county' | 'countryId';
//     basket: 'id' | 'usrId';
//     basketItem: 'id' | 'usrId' | 'productId' | 'date_added' | 'quantity';
//     category: 'id' | 'name';
//     country: 'id' | 'code' | 'name' | 'image_url';
//     currency: 'id' | 'code' | 'symbol' | 'gbp_exchange_rate';
//     order: 'id' | 'usrId' | 'date' | 'currencyId' | 'addressId';
//     orderItem: 'id' | 'orderId' | 'productId' | 'price' | 'quantity';
//     product: 'id' | 'sellerId' | 'title' | 'url' | 'description' | 'image_url' | 'image_alt' | 'price' | 'currencyId' | 'review_score' | 'review_count' | 'order_count' | 'categories';
//     review: 'id' | 'productId' | 'userId' | 'score' | 'title' | 'content' | 'image_urls' | 'date';
//     usr: 'id' | 'first_name' | 'user_name' | 'sub' | 'title' | 'countryId' | 'currencyId' | 'image_url';
// };

// Utility type to handle the union of the model and its includes
export type ResultType<T extends keyof TableMap, I extends IncludeMap[T]> = T & (I extends undefined ? {} : I)


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