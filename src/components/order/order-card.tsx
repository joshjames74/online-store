import { OrderView } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Grid, GridItem, Heading, HStack, Stack } from "@chakra-ui/react";
import { Order, OrderItem } from "@prisma/client";
import { useContext } from "react";
import ProductWide from "../product/product-wide";
import OrderProductCard from "./order-product-card";

export default function OrderCard({ params }: { params: { orderView: OrderView } }): JSX.Element {

    const { orderView, key } = params;
    const { theme } = useContext(ThemeContext);

    return (
        <Card minW="2xl" w="4xl" borderRadius="1em" overflow="hidden">

            <CardHeader bgColor={theme.colors.background.secondary}>
                <HStack>
                    <Stack>
                        <Heading fontSize="md">ORDER PLACED</Heading>
                        <Heading fontSize="md">{orderView.date}</Heading>
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
                    {orderView['OrderItem'].map((orderItemView, index: number) => (
                        <Grid templateColumns="4fr 1fr" key={index}>
                            <GridItem>
                                <OrderProductCard {...orderItemView.product}/>
                            </GridItem>
                            <GridItem>
                                <Button 
                                    w="fit-content"
                                    h="fit-content"
                                    padding="0.4em 1em"
                                    fontSize="xs"
                                    borderRadius="1em"
                                    >Write a review</Button>
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