import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrdersByUserId } from "@/api/request/orderRequest";
import { OrderView } from "@/api/services/orderService";
import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderCard from "./order-card";

export default function OrderGrid({ params }: { params: { id: number }}): JSX.Element {

    const { id } = params;
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderView[]>([]);


    const loadData = () => {

        const searchData = parseOrderSearchParams(searchParams);
        setIsLoading(true);

        getOrdersByUserId({id: 1, params: searchData}).then((res: OrderView[]) => {
            setOrders(res);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }


    useEffect(() => {
        loadData();
    }, [])


    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (!orders || !orders.length) {
        return <Box>No orders</Box>;
    }
  

    return (
        <Stack alignItems="center" marginTop="20px">
            {orders.length ? orders.map((orderView, index) => (
                <OrderCard params={{orderView: orderView}} key={index} />
            )) : <></>}
        </Stack>
    )

}