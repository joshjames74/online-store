import { Address, Category, Country, Currency, Product, Review, Usr } from "@prisma/client"
import { faker } from "@faker-js/faker";

export const generateMockProduct = (): Product => {
    const product: Product = {} as Product;
    product.sellerId = faker.number.int();
    product.title = faker.commerce.productName();
    product.description = faker.commerce.productDescription();
    product.price = faker.number.float({ fractionDigits: 2});
    product.review_count = faker.number.int({ min: 0});
    product.review_score = faker.number.float({ min: 0, max: 5 });
    product.image_url = faker.image.url();
    product.image_alt = faker.image.urlPlaceholder();
    product.order_count = faker.number.int({ min: 0});
    return product;
}

export const generateMockProducts = (count: number): Product[] => {
    return Array.from({ length: count }, generateMockProduct);
};


export const generateMockUser = (): Usr => {
    const user: Usr = {} as Usr;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    user.name = faker.person.fullName({ firstName: firstName, lastName: lastName });
    user.email = faker.internet.email({ firstName: firstName, lastName: lastName });
    user.image_url = faker.image.avatar();
    // to do: set currencyId, countryId
    return user;
};


export const generateMockReview = (): Review => {
    const review: Review = {} as Review;
    review.score = faker.number.int({ min: 0, max: 5});
    review.title = faker.lorem.sentence();
    review.image_urls = "";
    review.date = faker.date.recent();
    // to do: set productId, usrId
    return review;
};

export const generateMockAddress = (): Address => {
    const address: Address = {} as Address;
    address.name = faker.lorem.sentence();
    address.address_line_1 = faker.location.streetAddress();
    address.address_line_2 = `${faker.location.county()}, ${faker.location.state}`;
    address.area_code = faker.location.zipCode();
    // to do: set usrId, countryId 
    return address;
}

export const generateMockCountry = (): Country => {
    const country: Country = {} as Country;
    country.code = faker.location.countryCode('alpha-2');
    country.name = faker.location.country();
    country.image_url = faker.image.url();
    return country;
}

export const generateMockCurrency = (): Currency => {
    const currency: Currency = {} as Currency;
    const generatedCurrency = faker.finance.currency();
    currency.code = generatedCurrency.code;
    currency.symbol = generatedCurrency.symbol;
    currency.gbp_exchange_rate = faker.number.float({ min: 0.0001, max: 100000000 });
    return currency;
}

export const generateMockCategory = (): Category => {
    const category: Category = {} as Category;
    category.name = faker.commerce.department();
    return category;
}