import { OrderView } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Grid, GridItem, Heading, HStack, Stack } from "@chakra-ui/react";
import { useContext } from "react";
import OrderProductCard from "./order-product-card";
import { formatDate } from "@/api/helpers/utils";
import { ResultType } from "@/api/helpers/types";
import styles from "./order-card.module.css";


export default function OrderCard({ params }: { params: { orderView: OrderView } }): JSX.Element {

    const { orderView } = params;
    const { theme } = useContext(ThemeContext);

    type OrderItemView = ResultType<'orderItem', { product: { include: { currency: true } } }>

    return (
        <Card className={styles.container} borderRadius="1em" overflow="hidden">

            <CardHeader bgColor={theme.colors.background.secondary} padding="1em">
                <HStack className={styles.header_container}>
                    <Stack className={styles.info_container}>
                        <Heading className={styles.label} fontSize="md">ORDER PLACED</Heading>
                        <Heading className={styles.value} fontSize="md">{formatDate(orderView.date.toString())}</Heading>
                    </Stack>
                    <Stack className={styles.info_container}>
                        <Heading className={styles.label} fontSize="md">TOTAL</Heading>
                        <Heading className={styles.value} fontSize="md">£400.00</Heading>
                    </Stack>
                    <Stack className={styles.info_container}>
                        <Heading className={styles.label} fontSize="md">DISPATCHED TO</Heading>
                        <Heading className={styles.value} fontSize="md">{orderView.address.name}</Heading>
                    </Stack>
                </HStack>
            </CardHeader>

            <Divider />

            <CardBody>
                <Stack>
                    {orderView.OrderItem.map(
                        (item: OrderItemView, index: number) => (
                            <OrderProductCard {...item.product} key={index} />

                    ))}
                </Stack>
            </CardBody>

        </Card>
    )

}