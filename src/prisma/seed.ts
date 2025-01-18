import { ProductWithSeller } from "@/api/services/productService";
import {
  generateMockAddress,
  generateMockBasketItem,
  generateMockOrder,
  generateMockOrderItem,
  generateMockProduct,
  generateMockProductCategories,
  generateMockReview,
  generateMockUser,
} from "@/tests/generate";
import { Address, BasketItem, Order, OrderItem, PrismaClient, Product, ProductCategory, Review, Usr } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

export interface SeedConfig {
  userCount: number;
  productCount: number;
  reviewCount: number;
  orderCount: number;
  orderItemCount: number;
  basketItemCount: number;
  addressCount: number;
  productCategoriesCount: number;
};


export default class Seed {

  private prisma: PrismaClient;

  // seeding parameters
  private userCount: number;
  private productCount: number;
  private reviewCount: number;
  private orderCount: number;
  private orderItemCount: number;
  private basketItemCount: number;
  private addressCount: number;
  private productCategoriesCount: number;

  // entity parameters
  public currencyIds: number[] = [];
  public countryIds: number[] = [];
  public categoryIds: number[] = [];
  public usrIds: string[] = [];
  public productIds: number[] = [];
  public reviewIds: string[] = [];
  public orderIds: string[] = [];
  public orderItemIds: string[] = [];
  public basketItemIds: string[] = [];
  public addressIds: string[] = [];


  constructor(config: SeedConfig) {
    this.prisma = new PrismaClient();
    this.prisma.$connect();
    // generation parameters
    this.userCount = config.userCount;
    this.productCount = config.productCount;
    this.reviewCount = config.reviewCount;
    this.addressCount = config.addressCount;
    this.orderCount = config.orderCount;
    this.orderItemCount = config.orderItemCount;
    this.basketItemCount = config.basketItemCount;
    this.productCategoriesCount = config.productCategoriesCount;
  };


  // Methods to clear data

  public async deleteCountries(): Promise<void> {
    await this.prisma.country.deleteMany();
  };

  public async deleteCurrencies(): Promise<void> {
    await this.prisma.currency.deleteMany();
  };

  public async deleteCategories(): Promise<void> {
    await this.prisma.category.deleteMany();
  };

  public async deleteProducts(): Promise<void> {
    await this.prisma.product.deleteMany();
  };

  public async deleteReviews(): Promise<void> {
    await this.prisma.review.deleteMany();
  };

  public async deleteUsrAuths(): Promise<void> {
    await this.prisma.usrAuth.deleteMany();
  };

  public async deleteUsrs(): Promise<void> {
    await this.prisma.usr.deleteMany();
  };

  public async deleteAddresses(): Promise<void> {
    await this.prisma.address.deleteMany();
  };

  public async deleteOrders(): Promise<void> {
    await this.prisma.order.deleteMany();
  };

  public async deleteOrderItems(): Promise<void> {
    await this.prisma.orderItem.deleteMany();
  };

  public async deleteBasketItems(): Promise<void> {
    await this.prisma.basketItem.deleteMany();
  };

  public async deleteProductCategories(): Promise<void> {
    await this.prisma.productCategory.deleteMany();
  };

  // full 

  public async deleteAllEntities(): Promise<void> {
    await this.deleteOrderItems();
    await this.deleteBasketItems();
    await this.deleteReviews();
    await this.deleteOrders();
    await this.deleteAddresses();
    await this.deleteProductCategories();
    await this.deleteProducts();
    await this.deleteUsrs();
    await this.deleteUsrAuths();
    await this.deleteCountries();
    await this.deleteCurrencies();
    await this.deleteCategories();
  }


  // Get methods
  
  public async getCountryIds(): Promise<void> {
    const response = await this.prisma.country.findMany({ select: { id: true }});
    this.countryIds = response.map(res => res.id);
  };
  

  public async getCurrencyIds(): Promise<void> {
    const response = await this.prisma.currency.findMany({ select: { id: true }});
    this.currencyIds = response.map(res => res.id);
  };
  

  public async getCategoryIds(): Promise<void> {
    const response = await this.prisma.category.findMany({ select: { id: true }});
    this.categoryIds = response.map(res => res.id);
  };


  public async getProductIds(): Promise<void> {
    const response = await this.prisma.product.findMany({ select: { id: true }});
    this.productIds = response.map(res => res.id);
  };


  public async getUserIds(): Promise<void> {
    const response = await this.prisma.usr.findMany({ select: { id: true }});
    this.usrIds = response.map(res => res.id);
  };


  // Map methods

  public static getReviewMap(mockReviews: Review[]): Map<number, { score: number, count: number }> {
    const reviewMap = new Map<number, { score: number, count: number }>();
    for (const { productId, score } of mockReviews) {

      const prevCount = (reviewMap.get(productId)?.count || 0);
      const prevAverage = (reviewMap.get(productId)?.score || 0);

      const newCount = prevCount + 1;
      const newAverage = ((prevAverage * prevCount) + (score)) / (newCount);

      reviewMap.set(
        productId,
        { score: newAverage, count: newCount }
      );
    };
    return reviewMap;
  };


  public static getQuantityMap(mockOrderItems: OrderItem[]): Map<number, number> {
    const quantityMap = new Map<number, number>();
    for (const { productId, quantity } of mockOrderItems) {
      quantityMap.set(
        productId,
        (quantityMap.get(productId) || 0) + quantity
      );
    };
    return quantityMap;
  };


  // Fetch from database

  public async getUsers(): Promise<Usr[]> {
    const response = await this.prisma.usr.findMany({});
    return response;
  };


  public async getProductsWithSellers(): Promise<ProductWithSeller[]> {
    const response = await this.prisma.product.findMany({ where: {}, include: { seller: true } });
    return response;
  };

  
  // Save methods

  public async saveUsers(mockUsers: Usr[]): Promise<string[]> {
    const users = await this.prisma.usr.createManyAndReturn({ data: mockUsers });
    const userIds = users.map(user => user.id);
    return userIds;
  };

  public async saveAddresses(mockAddresses: Address[]): Promise<string[]> {
    const addresses = await this.prisma.address.createManyAndReturn({ data: mockAddresses });
    const addressIds = addresses.map(address => address.id);
    return addressIds;
  };

  public async saveProducts(mockProducts: Product[]): Promise<number[]> {
    const products = await this.prisma.product.createManyAndReturn({ data: mockProducts });
    const productIds = products.map(product => product.id);
    return productIds;
  };

  public async saveReviews(mockReviews: Review[]): Promise<string[]> {
    const reviewMap = Seed.getReviewMap(mockReviews);  
    const reviews = await this.prisma.$transaction(async (tx) => {

      // save reviews
      const reviews = await tx.review.createManyAndReturn({ data: mockReviews });

      // update product scores and counts

      // issue here: something to do with non uniqueness?

      for (const [productId, { score, count }] of reviewMap) {
        const { review_score, review_count } = await tx.product.findFirst({ select: { review_score: true, review_count: true }, where: { id: productId }}) || {};
        
        const newCount = (review_count || 0) + count;
        const newScore = (((review_score || 0) * (review_count || 0)) + (score * count)) / ((review_count || 0) + count);
        //console.log(`${productId}: { score: ${newScore}, count: ${newCount} }`);

        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            review_score: newScore,
            review_count: newCount,
          }
        });
      };

      return reviews;
    });
    const reviewIds = reviews.map(review => review.id);
    return reviewIds;
  };

  public async saveOrders(mockOrders: Order[]): Promise<string[]> {
    const orders = await this.prisma.order.createManyAndReturn({ data: mockOrders });
    const orderIds = orders.map(order => order.id);
    return orderIds;
  };

  public async saveOrderItems(mockOrderItems: OrderItem[]): Promise<string[]> {

    const quantityMap = Seed.getQuantityMap(mockOrderItems);
    const orderItems = await this.prisma.$transaction(async (tx) => {
      // save orderItems
      const orderItems = await tx.orderItem.createManyAndReturn({ data: mockOrderItems });

      for (const [productId, quantity] of quantityMap) {
        // update product order count
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: { 
            order_count: {
              increment: quantity
            }
          }
        });
      };

      return orderItems;
    });
    const orderItemIds = orderItems.map(orderItem => orderItem.id);
    return orderItemIds;
  };

  public async saveBasketItems(mockBasketItems: BasketItem[]): Promise<string[]> {
    const basketItems = await this.prisma.basketItem.createManyAndReturn({ data: mockBasketItems });
    const basketItemIds = basketItems.map(basketItem => basketItem.id);
    return basketItemIds;
  };

  public async saveProductCategories(mockProductCategories: ProductCategory[]): Promise<void> {
    const productCategories = await this.prisma.productCategory.createManyAndReturn({ data: mockProductCategories });
    return;
  };
  

  // Create methods

  public async createCountries(): Promise<void> {
    const sql = await readFile("../database/country.sql", { encoding: "utf-8" });
    await this.prisma.$executeRawUnsafe(sql);
  };

  public async createCurrencies(): Promise<void> {
    const sql = await readFile("../database/currency.sql", { encoding: "utf-8" });
    await this.prisma.$executeRawUnsafe(sql);
  };

  public async createCategories(): Promise<void> {
    const sql = await readFile("../database/category.sql", { encoding: "utf-8" });
    await this.prisma.$executeRawUnsafe(sql);
  };

  public async createUsers(count: number, countryIds: number[], currencyIds: number[]): Promise<string[]> {
    const mockUsers = Array.from({ length: count }, () => generateMockUser(countryIds, currencyIds));
    const ids = await this.saveUsers(mockUsers);
    return ids;
  };

  public async createAddresses(count: number, userIds: string[], countryIds: number[]): Promise<string[]> {
    const mockAddresses = Array.from({ length: count }, () => generateMockAddress(userIds, countryIds));
    const ids = await this.saveAddresses(mockAddresses);
    return ids;
  };

  public async createProducts(count: number, userIds: string[]): Promise<number[]> {
    const mockProducts = Array.from({ length: count }, () => generateMockProduct(userIds));
    const ids = await this.saveProducts(mockProducts);
    return ids;
  };

  public async createReviews(count: number, productIds: number[], userIds: string[]): Promise<string[]> {
    const mockReviews = Array.from({ length: count }, () => generateMockReview(productIds, userIds));
    const ids = await this.saveReviews(mockReviews);
    return ids;
  };

  public async createOrders(count: number, usrIds: string[], addressIds: string[], currencyIds: number[]): Promise<string[]> {
    const mockOrders = Array.from({ length: count }, () => generateMockOrder(usrIds, addressIds, currencyIds));
    const ids = this.saveOrders(mockOrders);
    return ids;
  };

  public async createOrderItems(count: number, orderIds: string[], productIds: number[]): Promise<string[]> {
    const mockOrderItems = Array.from({ length: count }, () => generateMockOrderItem(orderIds, productIds));
    const ids = this.saveOrderItems(mockOrderItems);
    return ids;
  };

  public async createBasketItems(count: number, userIds: string[], productIds: number[]): Promise<string[]> {
    const mockBasketItems = Array.from({ length: count }, () => generateMockBasketItem(productIds, userIds));
    const ids = this.saveBasketItems(mockBasketItems);
    return ids;
  };

  public async createProductCategories(count: number, productIds: number[], categoryIds: number[]): Promise<void> {
    const mockProductCategories = generateMockProductCategories(productIds, categoryIds);
    await this.saveProductCategories(mockProductCategories);
    return;
  };


  // Seeding methods

  public async seedCountries(): Promise<void> {
    await this.createCountries();
    await this.getCountryIds();
  };

  public async seedCurrencies(): Promise<void> {
    await this.createCurrencies();
    await this.getCurrencyIds();
  };

  public async seedCategories(): Promise<void> {
    await this.createCategories();
    await this.getCategoryIds();
  };

  public async seedUsers(): Promise<void> {
    const ids = await this.createUsers(this.userCount, this.countryIds, this.currencyIds);
    this.usrIds = ids;
  };

  public async seedAddresses(): Promise<void> {
    const ids = await this.createAddresses(this.addressCount, this.usrIds, this.countryIds);
    this.addressIds = ids;
  };

  public async seedProducts(): Promise<void> {
    const ids = await this.createProducts(this.productCount, this.usrIds);
    this.productIds = ids;
  }

  public async seedReviews(): Promise<void> {
    const ids = await this.createReviews(this.reviewCount, this.productIds, this.usrIds);
    this.reviewIds = ids;
  };

  public async seedOrders(): Promise<void> {
    const ids = await this.createOrders(this.orderCount, this.usrIds, this.addressIds, this.currencyIds);
    this.orderIds = ids;
  };

  public async seedOrderItems(): Promise<void> {
    const ids = await this.createOrderItems(this.orderItemCount, this.orderIds, this.productIds);
    this.orderItemIds = ids;
  };

  public async seedBasketItems(): Promise<void> {
    const ids = await this.createBasketItems(this.basketItemCount, this.usrIds, this.productIds);
    this.basketItemIds = ids;
  };

  public async seedProductCategories(): Promise<void> {
    await this.createProductCategories(this.productCategoriesCount, this.productIds, this.categoryIds);
  };


  // Seed 

  public async fullSeed(): Promise<void> {
    console.log("Running full seed...");

    // delete prev data
    await this.deleteAllEntities();

    // independent
    await this.seedCategories();
    await this.seedCountries();
    await this.seedCurrencies();

    console.log("Seeded categories, countries, and currencies");

    // dependent on countries and currencies
    await this.seedUsers();
    console.log("Seeded users");

    // dependent on users and countries
    await this.seedAddresses();
    console.log("Seeded addresses");

    // dependent on users
    await this.seedProducts();
    console.log("Seeded products");

    // dependent on products and users
    await this.seedReviews();
    console.log("Seeded reviews");

    // dependent on products and categories
    await this.seedProductCategories();
    console.log("Seeded product categories");

    // dependent on users, addresses, and currencies
    await this.seedOrders();
    console.log("Seeded orders");

    // dependent on orders and products
    await this.seedOrderItems();
    console.log("Seeded order items");

    // dependent on products and users
    await this.seedBasketItems();
    console.log("Seeded basket items");

    console.log("Seed completed successfully");
  };


  // Add methods 

  public async addProductCategories(count: number, productIds: number[]): Promise<void> {
    await this.getCategoryIds();
    await this.createProductCategories(count, productIds, this.categoryIds);
    console.log(`Added ${count} product categories successfully`);
  };

  public async addProductsAndProductCategories(count: number): Promise<void> {
    await this.getUserIds();
    this.productCount = count;

    const productIds = await this.createProducts(count, this.usrIds);
    console.log(`Added ${count} products successfully`);

    await this.addProductCategories(count, productIds);
  };

  public async addReviews(count: number): Promise<void> {
    await this.getProductIds();
    await this.getUserIds();
    await this.createReviews(count, this.productIds, this.usrIds);
    console.log(`Added ${count} reviews successfully`);
  };


  // Batch add methods


  // products

  private async singleBatchAddProducts(batchSize: number): Promise<void> {
    const productIds = await this.createProducts(batchSize, this.usrIds);
    console.log(`Added ${batchSize} products successfully`);

    await this.createProductCategories(batchSize, productIds, this.categoryIds);
    console.log(`Added ${batchSize} product categories successfully`);
  };

  public async batchAddProducts(count: number, batchSize: number): Promise<void> {
    let added: number = 0;
    await this.getCategoryIds();
    await this.getUserIds();
    while (added < count) {
      const currBatchSize = Math.min(batchSize, count - added);
      await this.singleBatchAddProducts(currBatchSize);
      added = added + currBatchSize;
    };
  };


  // reviews 

  private async singleBatchAddReviews(batchSize: number): Promise<void> {
    const reviewIds = await this.createReviews(batchSize, this.productIds, this.usrIds);
    console.log(`Added ${batchSize} reviews successfully`);
  }

  public async batchAddReviews(count: number, batchSize: number): Promise<void> {
    let added: number = 0;
    await this.getProductIds();
    await this.getUserIds();
    while (added < count) {
      const currBatchSize = Math.min(batchSize, count - added);
      await this.singleBatchAddReviews(currBatchSize);
      added = added + currBatchSize;
      console.log(`Added: ${added} / ${count}`);
    };
  };

};

async function main() {

  const config: SeedConfig = {
    userCount: 20,
    productCount: 20,
    reviewCount: 10,
    orderCount: 20,
    orderItemCount: 20,
    basketItemCount: 20,
    productCategoriesCount: 20,
    addressCount: 20,
  };

  const seed = new Seed(config);
  await seed.fullSeed();

  // await seed.batchAddProducts(500, 100);
  // await seed.batchAddReviews(5000, 10);
};


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

