import { OrderView } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Grid, GridItem, Heading, HStack, Stack } from "@chakra-ui/react";
import { Order, OrderItem } from "@prisma/client";
import { useContext } from "react";
import ProductWide from "../product/product-wide";
import OrderProductCard from "./order-product-card";
import { formatDate } from "@/api/helpers/utils";
import { ResultType } from "@/api/helpers/types";

export default function OrderCard({ params }: { params: { orderView: OrderView } }): JSX.Element {

    const { orderView } = params;
    const { theme } = useContext(ThemeContext);

    type OrderItemView = ResultType<'orderItem', { product: { include: { currency: true } } }>

    return (
        <Card minW="2xl" w="4xl" borderRadius="1em" overflow="hidden">

            <CardHeader bgColor={theme.colors.background.secondary}>
                <HStack>
                    <Stack>
                        <Heading fontSize="md">ORDER PLACED</Heading>
                        <Heading fontSize="md">{formatDate(orderView.date.toString())}</Heading>
                    </Stack>
                    <Stack>
                        <Heading fontSize="md">TOTAL</Heading>
                        <Heading fontSize="md">£400.00</Heading>
                    </Stack>
                    <Stack>
                        <Heading fontSize="md">DISPATCHED TO</Heading>
                        <Heading fontSize="md">{orderView.address.name}</Heading>
                    </Stack>
                </HStack>
            </CardHeader>

            <Divider />

            <CardBody>
                <Stack>
                    {orderView.OrderItem.map(
                        (item: OrderItemView, index: number) => (
                        <Grid templateColumns="4fr 1fr" key={index}>
                            <GridItem>
                                <OrderProductCard {...item.product}/>
                            </GridItem>
                            <GridItem>
                                <Button 
                                    w="fit-content"
                                    h="fit-content"
                                    padding="0.4em 1em"
                                    fontSize="xs"
                                    borderRadius="1em"
                                    >
                                        Write a review
                                    </Button>
                            </GridItem>
                        </Grid>
                    ))}
                </Stack>
            </CardBody>

            <Divider />

            <CardFooter>Archive</CardFooter>

        </Card>
    )

}