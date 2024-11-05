"use client";
import { getBasketByUserId, getBasketItemsByUserId } from "@/api/request/basketRequest";
import { Basket } from "@/api/services/basketItemService";
import SignInRequiredPage from "@/components/auth/sign-in-required-page";
import BasketPage from "@/components/basket/basket-page";
import EmptyBasket from "@/components/basket/empty-basket";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { useBasketStore } from "@/zustand/store";
import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Text } from "@chakra-ui/react";
import { BasketItem } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function Page(): JSX.Element {


    // const basket = useBasketStore((state) => state.basket);
    // const loadData = useBasketStore((state) => state.loadData);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user, isAuthenticated } = useContext(UserContext);

    // useEffect(() => {
    //     if (!user || !user?.id) { return };
    //     loadData(user.id).then(res => {
    //         console.log(res);
    //     }).catch(error => {
    //         console.error(error)
    //     }).finally(() => {
    //         setIsLoading(false)
    //     });
    // }, []);
    
    // create loading skeleton
    // if (isLoading) return <Box>Loading... </Box>

    // to do: redirect to 404 page
    //if (!isLoading && !isAuthenticated) return <Box>404 not found</Box>

    // to do: redirect to sign in?
    if (!isAuthenticated) return <SignInRequiredPage props={{message: "view basket"}}/>

    // redirect this
    if (!user) return <Box>User not found</Box>


    // return (
    // <Box>
    //     {isLoading ? <Box>Loading...</Box> : !basket ? <EmptyBasket /> : <BasketPage {...{params: {basket: basket}}}/>}
    // </Box>
    // )

    return <BasketPage />
}