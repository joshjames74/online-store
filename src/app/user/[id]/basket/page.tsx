"use client";
import { getBasketByUserId, getBasketItemsByUserId } from "@/api/request/basketRequest";
import { Basket } from "@/api/services/basketItemService";
import BasketPage from "@/components/basket/basket-page";
import EmptyBasket from "@/components/basket/empty-basket";
import { ThemeContext } from "@/contexts/theme-context";
import { useBasketStore } from "@/zustand/store";
import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Text } from "@chakra-ui/react";
import { BasketItem } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string }}): JSX.Element {

    const { id } = params;

    const basket = useBasketStore((state) => state.basket);
    const loadData = useBasketStore((state) => state.loadData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    if (!id || isNaN(parseInt(id))) {
        return <Box>404 not found</Box>
    }

    useEffect(() => {
        loadData(parseInt(id)).then(res => setIsLoading(false));
    }, [])

    return (
    <Box>
        {isLoading ? <Box>Loading...</Box> : !basket ? <EmptyBasket /> : <BasketPage {...{params: {basket: basket}}}/>}
    </Box>
    )
}