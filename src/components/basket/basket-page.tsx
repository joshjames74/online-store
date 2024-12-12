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
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import BasketProductCard from "./basket-product-card";
import { UserContext } from "@/contexts/user-context";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import styles from "./basket-page.module.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useBasketState } from "@/zustand/store";


export default function BasketPage(): JSX.Element {

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  console.log(user);

  const basket = useBasketState((state) => state.basket);
  const setUserId = useBasketState((state) => state.setUserId);
  const userId = useBasketState((state) => state.userId);
  const deleteBasket = useBasketState((state) => state.deleteBasket);
  const fetchBasket = useBasketState((state) => state.fetchBasket);

  useEffect(() => {
    setUserId(user.id);
  }, [user.id]);

  useEffect(() => {
    fetchBasket();
  }, [userId]);

  const handleDelete = async () => await deleteBasket();

  if (!basket || !basket?.items?.length) {
    return (
      <Card
        minW={theme.sizes.minWidth}
        className={styles.container}
        marginY="20px"
        flexGrow={1}
        maxW="xl"
      >
        <CardHeader paddingBottom={0}>
          <Heading fontSize="3xl" fontWeight="semibold">
            Basket is empty
          </Heading>
        </CardHeader>
        <CardBody>
          <Link href="/">
            <Text>Click here to shop for products</Text>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card
        minW={theme.sizes.minWidth}
        className={styles.container}
        marginY="20px"
      >
        <CardHeader paddingBottom={0}>
          <Heading fontWeight="semibold" fontSize="3xl">
            Shopping Basket
          </Heading>
          <Text
            color={theme.colors.accent.tertiary}
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={handleDelete}
          >
            Clear basket
          </Text>
        </CardHeader>

        <CardBody paddingBottom={0}>
          <Stack>
            {basket.items &&
              basket.items.map((basketItem, index: number) => (
                <BasketProductCard
                  key={index}
                  basketItem={basketItem}
                />
              ))}
          </Stack>

          <HStack justifyContent="right" marginTop="1em">
            <Heading
              fontWeight="semibold"
              fontSize="xl"
              display="flex"
              flexDirection="row"
            >
              Subtotal ({basket.metadata && basket.metadata.total.quantity}{" "}
              items):
            </Heading>
            <Text
              fontWeight="bold"
              fontSize="xl"
              color={theme.colors.semantic.success}
            >
              {basket.metadata &&
                convertAndFormatToUserCurrency(
                  basket.metadata.total.price,
                  user,
                )}
            </Text>
          </HStack>
        </CardBody>

        <CardFooter marginRight={0} marginLeft="auto">
          <Link href="/user/basket/checkout">
            <Button bgColor={theme.colors.accent.primary}>
              Checkout <ArrowRightOutlined />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
