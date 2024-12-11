import { Order, OrderItem } from "@prisma/client";
import {
  getEntitiesByFields,
  getOneEntityByField,
} from "../helpers/dynamicQuery";
import {
  OrderParams,
  orderQueryTransformer,
} from "../transformers/orderSearchTransformer";
import { queryParamsToPrismaQuery } from "../transformers";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

type IncludeType = {
  orderItem: {
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
};

const IncludeRelation = {
  orderItem: {
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
};

export type OrderView = ResultType<"order", IncludeType>;

export type OrderWithMetadata = {
  order: OrderView;
  metadata: {
    count: number;
    total: {
      price: number;
      items: number;
    };
  };
};

// GET methods

export async function getOrderViewById(id: number): Promise<any> {
  return await getOneEntityByField({
    modelName: "order",
    whereQuery: { id: id },
    include: { orderItem: true },
  });
}

export async function getOrderViewsBySearch(
  params: OrderParams,
): Promise<OrderWithMetadata[] | void> {
  // transform params to prisma query
  const { whereQuery, orderQuery, skip, take } = queryParamsToPrismaQuery(
    params,
    orderQueryTransformer,
  );
  // fetch orders
  const orders = await getEntitiesByFields({
    modelName: "order",
    whereQuery: whereQuery,
    orderQuery: orderQuery,
    skip: skip,
    take: take,
    include: IncludeRelation,
  });

  if (!orders) {
    throw new Error("Cannot get orders");
  }

  // compute metadata
  const ordersWithMetadata: OrderWithMetadata[] = orders.map(
    (order: OrderView) => {
      const totalPrice = order.orderItem.reduce(
        (prev, curr) => prev + curr.price * curr.quantity,
        0,
      );
      const count = order.orderItem.length;
      const totalItems = order.orderItem.reduce(
        (prev, curr) => prev + curr.quantity,
        0,
      );
      const metadata = {
        count: count,
        total: { items: totalItems, price: totalPrice },
      };
      return { order, metadata };
    },
  );
  return ordersWithMetadata;
}

// POST methods

export async function postOrder(data: {
  order: Omit<Order, "id">;
}): Promise<Order> {
  const { order } = data;

  return prisma.$transaction(async (tx) => {
    // post order
    const postedOrder = await tx.order.create({ data: order });
    if (!postedOrder) {
      throw new Error("Cannot post order");
    }

    // find items from the users basket
    const items = await tx.basketItem.findMany({
      where: { usrId: order.usrId },
      include: { product: true },
    });
    const orderItems: Omit<OrderItem, "id">[] = items.map((item) => {
      return {
        orderId: postedOrder.id,
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity,
      };
    });

    // post basket items
    const postedBasketItems = await tx.orderItem.createMany({
      data: orderItems,
    });
    if (!postedBasketItems) {
      throw new Error("Cannot post basketItems ");
    }

    // delete basket items from user
    const oldBasketItems = await tx.basketItem.deleteMany({
      where: { usrId: order.usrId },
    });
    if (!oldBasketItems) {
      throw new Error("Cannot delete old basket items");
    }

    return postedOrder;
  });
}
