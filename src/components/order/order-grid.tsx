import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrderViewsBySearch } from "@/api/request/orderRequest";
import { OrderView } from "@/api/services/orderService";
import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderCard from "./order-card";

export default function OrderGrid(): JSX.Element {

    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderView[]>([]);


    const loadData = () => {
        const searchData = parseOrderSearchParams(searchParams);
        setIsLoading(true);
        getOrderViewsBySearch(searchData).then((res: OrderView[]) => {
            setOrders(res)
            setIsLoading(false);
        });
    }


    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        console.log("Orders");
        console.log(orders);
    }, [orders]);
  

    return (
        isLoading ? <Box>Loading...</Box>   
        : 
        <Stack alignItems="center" marginTop="20px">
            {orders.length ? orders.map(orderView => (
                <OrderCard params={{orderView: orderView}} />
            )) : <></>}
        </Stack>
    )

}