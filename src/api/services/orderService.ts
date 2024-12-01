import {
  BasketItem,
  Order,
  OrderItem,
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
): Promise<OrderView[] | void> {
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

export async function postOrder(data: { order: Omit<Order, "id"> }): Promise<Order> {

  const { order } = data;

  return prisma.$transaction(async (tx) => {

    // post order
    const postedOrder = await tx.order.create({ data: order });
    if (!postedOrder) { throw new Error("Cannot post order") };

    // find items from the users basket
    const items = await tx.basketItem.findMany({ where: { usrId: order.usrId }, include: { product: true }});
    const orderItems: Omit<OrderItem, "id">[] = items.map(item => { return {
        orderId: postedOrder.id,
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity
    }});

    // post basket items
    const postedBasketItems = await tx.orderItem.createMany({ data: orderItems });
    if (!postedBasketItems) { throw new Error("Cannot post basketItems ") };

    // delete basket items from user
    const oldBasketItems = await tx.basketItem.deleteMany({ where: { usrId: order.usrId }});
    if (!oldBasketItems) { throw new Error("Cannot delete old basket items")};

    return postedOrder;
  });
}
