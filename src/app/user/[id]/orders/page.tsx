"use client";
import { getOrderViewById } from "@/api/request/orderRequest";
import OrderGrid from "@/components/order/order-grid";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function OrderPage({ params }: { params: { id: string }}): JSX.Element {


    // const { id } = params;
    // const [orders, setOrders] = useState<any>();
    // const [isLoading, setIsLoading] = useState<boolean>(true);


    // if (!id || isNaN(parseInt(id))) {
    //     return <Box>404 no found</Box>
    // }


    // useEffect(() => {
    //     getOrderViewById(parseInt(id)).then(res => {
    //         setOrders(res);
    //         setIsLoading(false)
    //     })

    //     console.log(orders);
    // }, [])

    // return (
    //     <Box>
    //         {isLoading ? <Box>Loading</Box> : <>Loaded</>}
    //     </Box>
    // )

    return <OrderGrid />

}