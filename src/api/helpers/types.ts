import { Address, Basket, BasketItem, Category, Country, Currency, Order, OrderItem, Prisma, PrismaClient, Product, Review, Usr } from "@prisma/client";

export type ModelType = 'address'
    | 'basket' 
    | 'category' 
    | 'country' 
    | 'currency' 
    | 'order' 
    | 'product' 
    | 'review' 
    | 'usr';

export type ModelMap = {
    address: Address;
    basket: Basket;
    basket_item: BasketItem;
    category: Category;
    country: Country;
    currency: Currency;
    order: Order;
    order_item: OrderItem;
    product: Product;
    review: Review;
    usr: Usr;
};

export type TableMap = {
    address: 'id' | 'usrId' | 'name' | 'number' | 'street_name' | 'postcode' | 'county' | 'countryId';
    basket: 'id' | 'usrId';
    basket_item: 'id' | 'basketId' | 'productId' | 'date_added' | 'quantity';
    category: 'id' | 'name';
    country: 'id' | 'code' | 'name' | 'image_url';
    currency: 'id' | 'code' | 'symbol' | 'gbp_exchange_rate';
    order: 'id' | 'usrId' | 'date' | 'currencyId' | 'addressId';
    order_item: 'id' | 'orderId' | 'productId' | 'price' | 'quantity';
    product: 'id' | 'sellerId' | 'title' | 'url' | 'description' | 'image_url' | 'image_alt' | 'price' | 'currencyId' | 'review_score' | 'review_count' | 'order_count' | 'categories';
    review: 'id' | 'productId' | 'userId' | 'score' | 'title' | 'content' | 'image_urls' | 'date';
    usr: 'id' | 'first_name' | 'user_name' | 'sub' | 'title' | 'countryId' | 'currencyId' | 'image_url';
  };