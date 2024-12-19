import { Order, OrderItem } from "@prisma/client";
import {
  OrderFilter,
  OrderParams,
} from "../transformers/orderSearchTransformer";
import { getSkipTakeFromPage } from "../transformers";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

///

export function createWhereQuery(params: Partial<OrderParams>) {
  const whereQuery: any = {};

  const dateQuery = {};

  if (params.min_date && params.min_date !== undefined) {
    Object.assign(dateQuery, { gte: params.min_date });
  }

  if (params.max_date && params.max_date !== undefined) {
    Object.assign(dateQuery, { lte: params.max_date });
  }

  if (dateQuery) {
    whereQuery.created_at = dateQuery;
  }

  if (params.usrId) {
    whereQuery.usrId = params.usrId;
  }

  return whereQuery;
}

export function getOrderFilterOrder(order_filter: OrderFilter): "asc" | "desc" {
  switch (order_filter) {
    case OrderFilter.DATE_NEW_OLD:
      return "desc";
    case OrderFilter.DATE_OLD_NEW:
      return "asc";
    case OrderFilter.TOTAL_HIGH_LOW:
      return "desc";
    case OrderFilter.TOTAL_LOW_HIGH:
      return "asc";
    default:
      return "asc";
  }
}

export function getOrderFilterColumn(
  order_filter: OrderFilter,
): "created_at" | "total" {
  switch (order_filter) {
    case OrderFilter.DATE_NEW_OLD:
      return "created_at";
    case OrderFilter.DATE_OLD_NEW:
      return "created_at";
    case OrderFilter.TOTAL_HIGH_LOW:
      return "total";
    case OrderFilter.TOTAL_LOW_HIGH:
      return "total";
    default:
      return "created_at";
  }
}

export function createOrderByQuery(params: Partial<OrderParams>): any {
  if (!params.order_filter) {
    return {};
  }
  const order = getOrderFilterOrder(params.order_filter);
  const column = getOrderFilterColumn(params.order_filter);
  return { [column]: order };
}

///

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

export type OrderItemView = ResultType<
  "orderItem",
  { product: { include: { seller: true } } }
>;

// GET methods

export async function getOrderViewById(id: string): Promise<any> {
  return await prisma.order.findFirst({
    where: { id: id },
    include: { orderItem: true },
  });
}

export async function getOrderViewsBySearch(
  params: OrderParams,
): Promise<OrderWithMetadata[] | void> {
  const whereQuery = createWhereQuery(params);
  const orderQuery = createOrderByQuery(params);
  const { skip, take } = getSkipTakeFromPage(params.perPage, params.pageNumber);

  const query = {
    where: whereQuery,
    orderBy: orderQuery,
    include: IncludeRelation,
  };

  if (skip) {
    Object.assign(query, { skip: skip });
  }

  if (take) {
    Object.assign(query, { take: take });
  }

  console.log(query);
  const orders = await prisma.order.findMany(query);

  if (!orders) {
    throw new Error("Cannot get orders");
  }

  // to do: store order metadata in database making this unnecessary
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
        created_at: item.created_at,
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
