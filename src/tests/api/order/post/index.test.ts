import { POST } from "@/app/api/order/route";
import prisma from "@/lib/prisma";
import {
    generateMany,
    generateMockAddress,
    generateMockBasketItem,
    generateMockCountry,
  generateMockCurrency,
  generateMockOrder,
  generateMockProduct,
  generateMockUser,
} from "@/tests/generate";
import { normaliseDate } from "@/tests/utils/helpers";
import { Address, BasketItem, Order, Product, Usr } from "@prisma/client";
import { NextRequest } from "next/server";


describe("POST /api/order", () => {

  let activeUser: Usr;
  let products: Product[];
  let basketItems: BasketItem[];
  let mockOrder: Order;

  beforeAll(async () => {

    const count = 2;

    // create users
    const mockUsers = generateMany<Usr>(count, generateMockUser);
    const users = await prisma.usr.createManyAndReturn({ data: mockUsers });
    const userIds = users.map((user) => user.id);

    activeUser = users[0];

    // create countries
    const mockCountries = Array.from({ length: count }, generateMockCountry);
    const countries = await prisma.country.createManyAndReturn({ data: mockCountries });
    const countryIds = countries.map((country) => country.id)

    // create currencies
    const mockCurrencies = Array.from({ length: count }, generateMockCurrency);
    const currencies = await prisma.currency.createManyAndReturn({ data: mockCurrencies });
    const currencyIds = currencies.map((currency) => currency.id)

    // create addresses
    const mockAddresses = Array.from({ length: count }, () => generateMockAddress(userIds, countryIds));
    const addresses = await prisma.address.createManyAndReturn({ data: mockAddresses });
    const addressIds = addresses.map((address) => address.id);

    // create products
    const mockProducts = Array.from({ length: count }, () => generateMockProduct(userIds));
    products = await prisma.product.createManyAndReturn({ data: mockProducts });
    const productIds = products.map((product) => product.id);

    // create basket items
    const mockBasketItems = Array.from({ length: count }, () => generateMockBasketItem(productIds, [activeUser.id]));
    basketItems = await prisma.basketItem.createManyAndReturn({ data: mockBasketItems });

    // create order
    mockOrder = generateMockOrder([activeUser.id], addressIds, currencyIds);
  });

  beforeEach(async () => {

    const count = 2;

    const productIds = products.map(product => product.id);

    // create basket items
    const mockBasketItems = Array.from({ length: count }, () => generateMockBasketItem(productIds, [activeUser.id]));
    basketItems = await prisma.basketItem.createManyAndReturn({ data: mockBasketItems });
  })

  afterEach(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.basketItem.deleteMany({});
  });

  afterAll(async () => {});

  it("valid data: should return a 201", async () => {
    const req = new NextRequest(`http://localhost/api/order`, {
      method: "POST",
      body: JSON.stringify({
        order: mockOrder,
        basketItems: basketItems
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it("valid data: should return the order", async () => {
    const req = new NextRequest(`http://localhost/api/order`, {
      method: "POST",
      body: JSON.stringify({
        order: mockOrder,
        basketItems: basketItems
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json: { data: Order } = await res.json();

    expect(normaliseDate(json.data)).toEqual({ ...normaliseDate(mockOrder), id: json.data.id });
  });

  it("valid data: should save the order", async () => {
    const req = new NextRequest(`http://localhost/api/order`, {
      method: "POST",
      body: JSON.stringify({
        order: mockOrder,
        basketItems: basketItems
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json: { data: Order } = await res.json();

    const order = await prisma.order.findFirst({ where: { id: json.data.id }});
    expect(normaliseDate(order)).toEqual(normaliseDate(json.data));
  });

  it("valid data: should save the order items", async () => {
    const req = new NextRequest(`http://localhost/api/order`, {
      method: "POST",
      body: JSON.stringify({
        order: mockOrder,
        basketItems: basketItems
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json: { data: Order } = await res.json();

    const orderItems = await prisma.orderItem.findMany({ where: { orderId: json.data.id }});
    expect(orderItems.length).toEqual(basketItems.length);
  });

  it("valid data: should delete the basket items", async () => {
    const req = new NextRequest(`http://localhost/api/order`, {
      method: "POST",
      body: JSON.stringify({
        order: mockOrder,
        basketItems: basketItems
      }),
      headers: { "Content-Type": "application/json" }, 
    });
    const res = await POST(req);

    const newBasketItems = await prisma.basketItem.findMany({ where: { usrId: activeUser.id }});
    expect(newBasketItems).toEqual([]);
  });
});
