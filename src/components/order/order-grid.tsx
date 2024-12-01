import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrdersByUserId } from "@/api/request/orderRequest";
import { OrderView } from "@/api/services/orderService";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderCard from "./order-card";

export default function OrderGrid({
  params,
}: {
  params: { id: number };
}): JSX.Element {
  const { id } = params;
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderView[]>([]);

  const loadData = () => {
    const searchData = parseOrderSearchParams(searchParams);
    setIsLoading(true);

    getOrdersByUserId({ id: id, params: searchData })
      .then((res: OrderView[]) => {
        setOrders(res);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!orders || !orders.length) {
    return <Box>No orders</Box>;
  }

  return (
    <Stack
      alignItems="center"
      padding="1em"
      border="1px solid red"
      width="100%"
      mx="auto"
    >
      <Box border="1px solid black">
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
