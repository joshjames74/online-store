import {
  Address,
  BasketItem,
  Currency,
  Order,
  OrderItem,
  Usr,
} from "@prisma/client";
import {
  getEntitiesByFields,
  getOneEntityByField,
} from "../helpers/dynamicQuery";
import {
  OrderParams,
  orderQueryTransformer,
} from "../transformers/orderSearchTransformer";
import { queryParamsToPrismaQuery } from "../transformers";
import { ResultType } from "../helpers/types";
import { Basket } from "./basketItemService";
import prisma from "@/lib/prisma";

// export type OrderView = Order & { OrderItem: OrderItem[], address: Address, currency: Currency, usr: Usr };

export type OrderView = ResultType<
  "order",
  {
    OrderItem: {
      include: {
        product: {
          include: {
            seller: true;
          };
        };
      };
    };
    address: true;
    currency: true;
    usr: true;
  }
>;

// GET methods

export async function getOrderViewById(id: number): Promise<any> {
  return await getOneEntityByField("order", "id", id, { OrderItem: true });
}

export async function getOrderViewsBySearch(
  params: OrderParams,
): Promise<OrderView | void> {
  const { whereQuery, orderQuery } = queryParamsToPrismaQuery(
    params,
    orderQueryTransformer,
  );
  const orders = await getEntitiesByFields(
    "order",
    whereQuery,
    orderQuery,
    0,
    0,
    {
      OrderItem: {
        include: {
          product: {
            include: {
              seller: true,
            },
          },
        },
      },
      address: true,
      currency: true,
      usr: true,
    },
  );
  return orders;
}

// POST methods

export async function postOrder(data: {
  order: Omit<Order, "id">,
  basketItems: BasketItem[],
}): Promise<Order> {

  const { order, basketItems } = data;

  return prisma.$transaction(async (tx) => {

    // post order
    const postedOrder = await tx.order.create({ data: order });
    if (!postedOrder) { throw new Error("Cannot post order") };

    // post basket items
    const orderItems: Omit<OrderItem, "id">[] = await Promise.all(basketItems.map(async (item) => {
      // get product price
      const product = await tx.product.findFirst({ where: { id: item.productId }});
      if (!product) { throw new Error ("Cannot find product")}

      return {
        orderId: postedOrder.id,
        productId: item.productId,
        price: product.price,
        quantity: item.quantity,
      };
    }));

    const postedBasketItems = await tx.orderItem.createMany({ data: orderItems });
    if (!postedBasketItems) { throw new Error("Cannot post basketItems ") };

    return postedOrder;
  });
}
