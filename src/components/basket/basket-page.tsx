import { ThemeContext } from "@/contexts/theme-context"
import { Card, CardBody, CardFooter, CardHeader, Divider, Heading, Stack, Text } from "@chakra-ui/react"
import { useContext } from "react"
import BasketProductCard from "./basket-product-card";
import { BasketItem } from "@prisma/client";

export default function BasketPage({ params }: { params: { basket: BasketItem[] } }): JSX.Element {


    const { theme } = useContext(ThemeContext);
    const { basket } = params;

    console.log("basket at basket")
    console.log(basket);
    console.log(basket.length);

    return (    
        <Card maxW="4xl">

            <CardHeader>
                <Heading fontWeight="semibold" fontSize="3xl">Shopping Basket</Heading>
                <Text color={theme.colors.accent.tertiary}>Delect All</Text>
            </CardHeader>

            <Divider />

            <CardBody maxH="lg" overflowY="scroll">
                <Stack>
                    {basket.length && basket.map(basketItem => <BasketProductCard {...basketItem} />)}
                </Stack>
            </CardBody>

            <Divider />

            <CardFooter marginRight={0} marginLeft="auto">
                <Heading fontWeight="normal" fontSize="xl">Subtotal (3 items): <b>£224.97</b></Heading>
            </CardFooter>

        </Card>
    )
}
