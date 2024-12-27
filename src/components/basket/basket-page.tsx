"use client";
import { ThemeContext } from "@/contexts/theme-context";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import BasketProductCard from "./basket-product-card";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { useBasketState, useUserState } from "@/zustand/store";


export default function BasketPage(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const [isLessThan500px] = useMediaQuery("(max-width: 500px)");

  const currency = useUserState((state) => state.currency);
  const user = useUserState((state) => state.user);

  const basket = useBasketState((state) => state.basket);
  const isLoading = useBasketState((state) => state.isLoading);
  const updateUser = useBasketState((state) => state.updateUserId);
  const deleteBasket = useBasketState((state) => state.deleteBasket);

  const handleDelete = async () => await deleteBasket();

  useEffect(() => {
    if (!user.id) return;
    updateUser(user.id);
  }, [user.id]);

  if (!basket || !basket?.items?.length) {
    return (
      <Card
        marginY="20px"
        flexGrow={1}
        maxW="xl"
        shadow="none"
      >
        <CardHeader paddingBottom={0}>
          <Heading as="h1">
            Basket is empty
          </Heading>
        </CardHeader>
        <CardBody>
          <Link href="/">
            <Text as="h4">Click here to shop for products</Text>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card
        w="max-content"
        shadow="none"
      >
        <CardHeader paddingBottom={0}>
          <Heading as="h1">Basket</Heading>
          <Heading
            cursor="pointer"
            fontWeight="semibold"
            _hover={{ textDecoration: "underline" }}
            onClick={handleDelete}
            as="h3"
            className="muted-heading"
          >
            Clear basket
          </Heading>
        </CardHeader>

        <CardBody paddingBottom={0}>
          <Stack gap="1em">
            {basket.items &&
              basket.items.map((basketItem, index: number) => (
                <BasketProductCard key={index} basketItem={basketItem} />
              ))}
          </Stack>

          <HStack 
          alignItems="flex-start"
          justifyContent={isLessThan500px ? "flex-start" : "right"} 
          w="full" 
          marginTop="1em"
          flexDirection={isLessThan500px ? "column" : "row"}>
            <Heading as="h3" className="muted-heading noOfLines-1">
              Subtotal ({basket.metadata && basket.metadata.total.quantity} items):
            </Heading>
            <Heading as="h3">
              {basket.metadata &&
                convertAndFormatToUserCurrency(
                  basket.metadata.total.price,
                  currency,
                )}
            </Heading>
          </HStack>
        </CardBody>

        <CardFooter marginRight={0} marginLeft="auto">
          <Link href="/user/basket/checkout">
            <Button className="primary-button" bgColor={`${theme.colors.accent.primary} !important`}>Checkout</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
