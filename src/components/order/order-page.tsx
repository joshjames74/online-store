"use client";
import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrdersByUserId } from "@/api/request/orderRequest";
import { OrderWithMetadata } from "@/api/services/orderService";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderCard from "./order-card";
import Link from "next/link";
import { useUserState } from "@/zustand/store";

export default function OrderPage(): JSX.Element {
  const user = useUserState((state) => state.user);
  const id = user.id;

  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderWithMetadata[]>([]);

  const loadData = () => {
    const searchData = parseOrderSearchParams(searchParams);
    setIsLoading(true);

    getOrdersByUserId({ id: id, params: searchData })
      .then((res: OrderWithMetadata[]) => setOrders(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!orders || !orders.length) {
    return (
      <Stack textAlign="center" w="full" marginTop="1em">
        <Text>No orders</Text>
        <Link href="/">
          <Text>Click here to continue shopping</Text>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" padding="1em" width="100%" mx="auto">
      <Box>
        <Breadcrumb separator=">">
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/account">Your Account</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={true}>
            <BreadcrumbLink>Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Stack marginTop="1em">
          {orders.length ? (
            orders.map((orderView, index) => (
              <OrderCard params={{ orderView: orderView }} key={index} />
            ))
          ) : (
            <></>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
