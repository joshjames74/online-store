import {
  Address,
  BasketItem,
  Category,
  Country,
  Currency,
  Order,
  Product,
  Review,
  Usr,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  Basket,
  BasketItemWithProduct,
} from "@/api/services/basketItemService";
import { ProductWithSeller } from "@/api/services/productService";

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export type Model =
  | Product
  | Usr
  | Review
  | Address
  | Country
  | Currency
  | Category;

export function generateMany<M extends Model>(
  count: number,
  func: () => M,
): M[] {
  return Array.from({ length: count }, func);
}

export const generateMockProduct = (ids?: number[]): Product => {
  const product: Product = {} as Product;
  product.sellerId = faker.number.int({ max: 10000 });
  // pick a random id
  if (ids) {
    product.sellerId = getRandomElement(ids);
  }
  product.title = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = faker.number.float({ fractionDigits: 2, max: 10000 });
  product.review_count = faker.number.int({ min: 0, max: 10000 });
  product.review_score = faker.number.float({ min: 0, max: 5 });
  product.image_url = faker.image.url();
  product.image_alt = faker.image.urlPlaceholder();
  product.order_count = faker.number.int({ min: 0, max: 10000 });
  product.url = faker.internet.url();
  return product;
};

export const generateMockProductWithSeller = (
  sellers: Usr[],
): ProductWithSeller => {
  const product: ProductWithSeller = {} as ProductWithSeller;
  const seller = getRandomElement(sellers);
  product.seller = seller;
  product.sellerId = seller.id;
  product.title = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = faker.number.float({ fractionDigits: 2, max: 10000 });
  product.review_count = faker.number.int({ min: 0, max: 10000 });
  product.review_score = faker.number.float({ min: 0, max: 5 });
  product.image_url = faker.image.url();
  product.image_alt = faker.image.urlPlaceholder();
  product.order_count = faker.number.int({ min: 0, max: 10000 });
  product.url = faker.internet.url();
  return product;
};

export const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, generateMockProduct);
};

export const generateMockUser = (): Usr => {
  const user: Usr = {} as Usr;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  user.name = faker.person.fullName({
    firstName: firstName,
    lastName: lastName,
  });
  user.email = faker.internet.email({
    firstName: firstName,
    lastName: lastName,
  });
  user.image_url = faker.image.avatar();
  user.currencyId = null;
  user.countryId = null;
  user.defaultAddressId = null;
  return user;
};

export const generateMockReview = (
  productIds: number[],
  usrIds: number[],
): Review => {
  const review: Review = {} as Review;
  review.productId = getRandomElement(productIds);
  review.usrId = getRandomElement(usrIds);
  review.score = faker.number.int({ min: 0, max: 5 });
  review.title = faker.lorem.sentence();
  review.image_urls = "";
  review.date = faker.date.recent();
  review.content = faker.lorem.paragraph({ min: 0, max: 10 });
  return review;
};

export const generateMockAddress = (
  usrIds: number[],
  countryIds: number[],
): Address => {
  const address: Address = {} as Address;
  address.usrId = getRandomElement(usrIds);
  address.name = faker.lorem.sentence();
  address.address_line_1 = faker.location.streetAddress();
  address.address_line_2 = `${faker.location.county()}, ${faker.location.state}`;
  address.area_code = faker.location.zipCode();
  address.countryId = getRandomElement(countryIds);
  return address;
};

export const generateMockCountry = (): Country => {
  const country: Country = {} as Country;
  country.code = faker.location.countryCode("alpha-2");
  country.name = faker.location.country();
  country.image_url = faker.image.url();
  return country;
};

export const generateMockCountries = (count: number): Country[] => {
  return Array.from({ length: 10 }, generateMockCountry);
};

export const generateMockCurrency = (currencyIds?: number[]): Currency => {
  const currency: Currency = {} as Currency;
  const generatedCurrency = faker.finance.currency();
  currency.code = generatedCurrency.code;
  currency.symbol = generatedCurrency.symbol;
  currency.gbp_exchange_rate = faker.number.float({
    min: 0.0001,
    max: 100000000,
  });
  if (currencyIds) {
    currency.id = getRandomElement(currencyIds);
  }
  return currency;
};

export const generateMockCategory = (): Category => {
  const category: Category = {} as Category;
  category.name = faker.commerce.department();
  return category;
};

export const generateMockBasketItemWithProduct = (
  productIds: number[],
  usrIds: number[],
): BasketItemWithProduct => {
  const basketItem: BasketItemWithProduct = {} as BasketItemWithProduct;

  const product: Product = generateMockProduct(usrIds);
  product.id = getRandomElement(productIds);

  basketItem.productId = product.id;
  basketItem.product = product;
  basketItem.quantity = faker.number.int({ min: 0, max: 100 });
  basketItem.usrId = getRandomElement(usrIds);
  basketItem.date_added = faker.date.recent();

  return basketItem;
};

export const generateMockBasketItem = (
  productIds: number[],
  usrIds: number[],
): BasketItem => {
  const basketItem: BasketItem = {} as BasketItem;

  basketItem.date_added = faker.date.recent();
  basketItem.productId = getRandomElement(productIds);
  basketItem.quantity = faker.number.int({ min: 1, max: 100 });
  basketItem.usrId = getRandomElement(usrIds);

  return basketItem;
};

export const generateMockBasketFromItems = (
  items: BasketItemWithProduct[],
): Basket => {
  const quantity = items.reduce((prev, curr) => prev + curr.quantity, 0);
  const price = items.reduce((prev, curr) => prev + curr.product.price, 0);

  const metadata = {
    count: items.length,
    total: {
      quantity: quantity,
      price: price,
    },
  };

  const basket: Basket = { items: items, metadata: metadata };
  return basket;
};

export const generateMockBasket = (
  productIds: number[],
  usrIds: number[],
): Basket => {
  const count = faker.number.int({ min: 1, max: 20 });
  const items = Array.from({ length: count }, () =>
    generateMockBasketItemWithProduct(productIds, usrIds),
  );

  const quantity = items.reduce((prev, curr) => prev + curr.quantity, 0);
  const price = items.reduce((prev, curr) => prev + curr.product.price, 0);

  const metadata = {
    count: count,
    total: {
      quantity: quantity,
      price: price,
    },
  };

  const basket: Basket = { items: items, metadata: metadata };
  return basket;
};

export const generateMockOrder = (
  usrIds: number[],
  addressIds: number[],
  currencyIds: number[],
): Order => {
  const order: Order = {} as Order;
  order.addressId = getRandomElement(addressIds);
  order.currencyId = getRandomElement(currencyIds);
  order.usrId = getRandomElement(usrIds);
  order.date = faker.date.recent();
  return order;
};
