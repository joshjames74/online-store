"use client";
import { getOrderViewById } from "@/api/request/orderRequest";
import OrderGrid from "@/components/order/order-grid";
import { UserContext } from "@/contexts/user-context";
import { Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

export default function OrderPage(): JSX.Element {

    
    const { user, isAuthenticated, isLoading } = useContext(UserContext);

    // create loading skeleton
    if (isLoading) return <Box>Loading... </Box>

    // to do: redirect to 404 page
    if (!isLoading && !isAuthenticated) return <Box>404 not found</Box>

    // redirect this
    if (!user) return <Box>User not found</Box>

    console.log(user);

    return <OrderGrid params={{ id: user.id }} />

}