import { ThemeContext } from "@/contexts/theme-context"
import { Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Heading, Stack, Text } from "@chakra-ui/react"
import { useContext } from "react"
import BasketProductCard from "./basket-product-card";
import { Basket, BasketItemWithProduct } from "@/api/services/basketItemService";
import { useBasketStore } from "@/zustand/store";

export default function BasketPage({ params }: { params: { basket: Basket } }): JSX.Element {


    const { theme } = useContext(ThemeContext);
    const { basket } = params;

    const isLoading = useBasketStore((state) => state.isLoading);

    return ( basket && 
        <Card minW="4xl" marginLeft="auto" marginRight="auto" marginY="20px" w="fit-content">

            <CardHeader>
                <Heading fontWeight="semibold" fontSize="3xl">Shopping Basket {isLoading ? <CircularProgress size="1em" isIndeterminate /> : <></>}</Heading>
                <Text color={theme.colors.accent.tertiary}>Delect All</Text>
            </CardHeader>

            <Divider />

            <CardBody>
                <Stack>
                    {basket.items && basket.items.map(basketItem => <BasketProductCard basketItem={basketItem} />)}
                </Stack>
            </CardBody>

            <Divider />

            <CardFooter marginRight={0} marginLeft="auto">
                <Heading fontWeight="normal" fontSize="xl">Subtotal ({basket.metadata && basket.metadata.total.quantity} items): <b>{basket.metadata && basket.metadata.total.price}</b></Heading>
            </CardFooter>

        </Card>
    )
}
