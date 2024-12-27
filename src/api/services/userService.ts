import { Usr } from "@prisma/client";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";
import {
  generateMockAddress,
  generateMockBasketItem,
  generateMockOrder,
  generateMockOrderItem,
  generateMockReview,
} from "./generate";

export type UserWithCurrencyAndCountry = ResultType<
  "usr",
  { currency: true; country: true }
>;

// GET methods

export async function getUserById(id: string): Promise<Usr | null> {
  return await prisma.usr.findFirst({
    where: { id: id },
  });
}

export async function getUserByAuthId(id: string): Promise<Usr | null> {
  return await prisma.usr.findFirst({
    where: { authId: id },
  });
}

// POST methods

export async function postUser(
  user: Partial<Omit<Usr, "user_id">>,
): Promise<Usr | void> {
  user.id = crypto.randomUUID();
  return await prisma.usr.create({
    data: user,
  });
}

export async function postUserGenerateData(
  userId: string,
): Promise<Usr | null> {
  //

  // fetch existing seeded data

  const productCount = 20;
  const currencyCount = 20;
  const countryCount = 20;

  const productIds = await prisma.product
    .findMany({ select: { id: true }, take: productCount })
    .then((products) => products.map((product) => product.id));
  const countryIds = await prisma.country
    .findMany({ select: { id: true }, take: countryCount })
    .then((countries) => countries.map((country) => country.id));
  const currencyIds = await prisma.currency
    .findMany({ select: { id: true }, take: currencyCount })
    .then((currencies) => currencies.map((currency) => currency.id));

  // create new data

  const reviewCount = 20;
  const orderCount = 20;
  const orderItemCount = 20;
  const basketItemCount = 20;
  const addressCount = 10;

  // addresses
  const mockAddresses = Array.from({ length: addressCount }, () =>
    generateMockAddress([userId], countryIds),
  );
  const addresses = await prisma.address.createManyAndReturn({
    data: mockAddresses,
  });
  const addressIds = addresses.map((address) => address.id);
  console.log("Created addresses");

  // reviews
  const mockReviews = Array.from({ length: reviewCount }, () =>
    generateMockReview(productIds, [userId]),
  );
  const reviews = await prisma.review.createManyAndReturn({
    data: mockReviews,
  });
  console.log("Created reviews");

  // orders
  const mockOrders = Array.from({ length: orderCount }, () =>
    generateMockOrder([userId], addressIds, currencyIds),
  );
  const orders = await prisma.order.createManyAndReturn({ data: mockOrders });
  const orderIds = orders.map((order) => order.id);
  console.log("Created orders");

  // orderItems
  const mockOrderItems = Array.from({ length: orderItemCount }, () =>
    generateMockOrderItem(orderIds, productIds),
  );
  const orderItems = await prisma.orderItem.createManyAndReturn({
    data: mockOrderItems,
  });
  console.log("Created order items");

  // basket
  const mockBasketItems = Array.from({ length: basketItemCount }, () =>
    generateMockBasketItem(productIds, [userId]),
  );
  const basktetItems = await prisma.basketItem.createManyAndReturn({
    data: mockBasketItems,
  });
  console.log("Created basket items");

  return await prisma.usr.findFirst({ where: { id: userId } });
}

// DELETE methods

export async function deleteUserById(id: string): Promise<Usr | void> {
  return await prisma.usr.delete({
    where: { id: id },
  });
}

// PUT methods

export async function putUserCountryById({
  params,
}: {
  params: { id: string; countryId: number };
}): Promise<Usr | void> {
  return await prisma.usr.update({
    where: { id: params.id },
    data: { countryId: params.countryId },
  });
}

export async function putUserCurrencyById({
  params,
}: {
  params: { id: string; currencyId: number };
}): Promise<Usr | void> {
  return await prisma.usr.update({
    where: { id: params.id },
    data: { currencyId: params.currencyId },
  });
}

export async function putUserDefaultAddress({
  params,
}: {
  params: { userId: string; addressId: string };
}): Promise<Usr | void> {
  const { userId, addressId } = params;
  return prisma.$transaction(async (tx) => {
    // ensure that the address was created by this user
    const address = await tx.address.findFirst({ where: { id: addressId } });
    if (!address) throw new Error("Cannot find address");
    if (address.usrId !== userId) throw new Error("Invalid address");

    // change the current (if exists) default address to a non-default address
    const user = await tx.usr.findFirst({ where: { id: userId } });
    if (!user) throw new Error("Cannot find user");

    if (user.defaultAddressId) {
      const prevAddressId = user.defaultAddressId;
      const prevAddress = await tx.address.update({
        where: { id: prevAddressId },
        data: { isDefault: false },
      });
      if (!prevAddress) throw new Error("Cannot update prev address");
    }

    // update user default address id
    const updatedUser = await tx.usr.update({
      where: { id: userId },
      data: { defaultAddressId: addressId },
    });
    if (!updatedUser) throw new Error("Cannot update default address id");

    // update is default status of address
    const updatedAddress = await tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
    if (!updatedAddress) throw new Error("Canoot update isdefault");

    return updatedUser;
  });
}
