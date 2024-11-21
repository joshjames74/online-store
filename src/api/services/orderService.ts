import { Address, Currency, Order, OrderItem, Usr } from "@prisma/client";
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
