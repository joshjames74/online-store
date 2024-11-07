import { ThemeContext } from "@/contexts/theme-context"
import { Box, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import BasketProductCard from "./basket-product-card";
import { Basket } from "@/api/services/basketItemService";
import { useBasketStore } from "@/zustand/store";
import { UserContext } from "@/contexts/user-context";
import { getBasketByUserId } from "@/api/request/basketRequest";
import { getProductPrice } from "@/api/helpers/utils";


export default function BasketPage(): JSX.Element {


    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    
    const [basket, setBasket] = useState<Basket>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadData = async () => {
        if (!user || !user.id) { return }
        getBasketByUserId(user.id).then(res => {
            setBasket(res)
        }).catch(error => {
            console.error(error);
        })
    }

    useEffect(() => {
        setIsLoading(true);
        loadData();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        setIsLoading(true);
        loadData();
        setIsLoading(false);
    }, [user])

    if (!user || !user.id) {
        return <Box>User not found</Box>
    } 

    if (isLoading) {
        return <Box>Loading</Box>
    }

    if (!basket || !basket.items.length) {
        return (
            <Card w="4xl" marginLeft="auto" marginRight="auto" marginY="20px">
                <CardHeader>
                    <Heading fontSize="3xl" fontWeight="semibold">Basket is empty</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Link href="/">
                        <Text>Click here to shop for products</Text>
                    </Link>
                </CardBody>
            </Card>
        )
    }


    return (
        <Card minW={theme.sizes.minWidth} marginLeft="auto" marginRight="auto" marginY="20px" w="fit-content">

            <CardHeader>
                <Heading fontWeight="semibold" fontSize="3xl">Shopping Basket {isLoading ? <CircularProgress size="1em" isIndeterminate /> : <></>}</Heading>
                <Text color={theme.colors.accent.tertiary}>Delect All</Text>
            </CardHeader>

            <Divider />

            <CardBody>
                <Stack>
                    {basket.items && basket.items.map((basketItem, index: number) => <BasketProductCard key={index} basketItem={basketItem} loadData={loadData} />)}
                </Stack>
            </CardBody> 

            <Divider />

            <CardFooter marginRight={0} marginLeft="auto">
                <Heading fontWeight="normal" fontSize="xl">
                    Subtotal ({basket.metadata && basket.metadata.total.quantity} items): 
                    <b>{basket.metadata && getProductPrice(basket.metadata.total.price, 1, user)}</b>
                </Heading>
            </CardFooter>

        </Card>
    )
}
