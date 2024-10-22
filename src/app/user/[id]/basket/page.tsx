"use client";
import { getBasketItemsByUserId } from "@/api/request/basketRequest";
import BasketPage from "@/components/basket/basket-page";
import EmptyBasket from "@/components/basket/empty-basket";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Text } from "@chakra-ui/react";
import { BasketItem } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string }}): JSX.Element {


    const { id } = params;

    const [basket, setBasket] = useState<BasketItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    if (!id || isNaN(parseInt(id))) {
        return <Box>404 not found</Box>
    }

    const loadData = () => {
        setIsLoading(true);
        getBasketItemsByUserId(parseInt(id)).then(res => {
            console.log(res);
            setBasket(res)
        });
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
    <Box>
        {isLoading ? <Box>Loading...</Box> : !basket.length ? <EmptyBasket /> : <BasketPage {...{params: {basket: basket}}}/>}
    </Box>
    )
}