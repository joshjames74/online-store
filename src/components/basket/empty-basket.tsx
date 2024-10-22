import { Card, Heading, Text } from "@chakra-ui/react";

export default function EmptyBasket(): JSX.Element {
    return (
        <Card maxW="sm" minH="sm" padding="10px">
            <Heading fontSize="xl" fontWeight="semibold">Basket is empty</Heading>
            <Text>Check your saved for later items or continue shopping</Text>
        </Card>
    )
}
