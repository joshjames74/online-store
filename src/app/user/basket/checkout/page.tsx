"use client"
import { getBasketByUserId } from "@/api/request/basketRequest";
import { Basket } from "@/api/services/basketItemService";
import CheckoutPage from "@/components/checkout/checkout-page";
import { UserContext } from "@/contexts/user-context";
import { Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

export default function Page(): JSX.Element {

    const [basket, setBasket] = useState<Basket>({} as Basket);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user || !user.id) { return };
        setIsLoading(true);
        getBasketByUserId(user.id)
            .then(res => setBasket(res))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [user]);

    if (!user || !user.id) { return <></> }

    if (isLoading) { return <></> }

    if (!basket || !basket.items?.length) { return <></>}

    return (
    <Box 
    w="full"
    display="flex"
    justifyContent="center"
    marginTop="1em">
        <CheckoutPage params={{ basket: basket }} />
    </Box>
    )
}