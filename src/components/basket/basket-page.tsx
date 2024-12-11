"use client";
import { ThemeContext } from "@/contexts/theme-context";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  Divider,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import BasketProductCard from "./basket-product-card";
import { Basket } from "@/api/services/basketItemService";
import { UserContext } from "@/contexts/user-context";
import {
  deleteBasketById,
  getBasketByUserId,
} from "@/api/request/basketRequest";
import { convertAndFormatToUserCurrency, parseDate } from "@/api/helpers/utils";
import styles from "./basket-page.module.css";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function BasketPage(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const [basket, setBasket] = useState<Basket>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // load and set basket
  const loadData = async (cache?: RequestCache) => {
    if (!user || !user.id) {
      return;
    }
    getBasketByUserId(user.id, cache ? cache : "force-cache")
      .then((res) => setBasket(res))
      .catch((error) => console.error(error));
  };

  // load on first load and when user changes
  useEffect(() => {
    setIsLoading(true);
    loadData();
    setIsLoading(false);
  }, [user]);

  // manage deleting basket
  const handleDelete = () => {
    setIsLoading(true);
    deleteBasketById(user.id)
      .then((res) => {
        // reload basket call
        getBasketByUserId(user.id, "reload")
          .then(() => {})
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return <Box>Loading</Box>;
  }

  if (!user || !user.id) {
    return <Box>User not found</Box>;
  }

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
            Shopping Basket{" "}
            {isLoading ? (
              <CircularProgress size="1em" isIndeterminate />
            ) : (
              <></>
            )}
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
                  loadData={loadData}
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
