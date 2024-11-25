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
import { useForm } from "react-hook-form";
import { BasketItem, Order } from "@prisma/client";


export default function BasketPage(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const [basket, setBasket] = useState<Basket>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // load and set basket
  const loadData = async (cache?: RequestCache) => {
    if (!user || !user.id) {
      return;
    }
    getBasketByUserId(user.id, cache ? cache : "force-cache")
      .then((res) => {
        setBasket(res);
      })
      .catch((error) => {
        console.error(error);
      });
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
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = (event: FormEvent<any>) => {
    const formData = new FormData(event.target);
    const formObject: Order & { basketItems: BasketItem[] } = Object.fromEntries(formData)

    const order: Omit<Order, "id"> = {} as Order;
    order.addressId = parseInt(formObject["addressId"] || "");
    order.currencyId = parseInt(formObject["currencyId"] || "");
    order.usrId = parseInt(formObject["usrId"] || "");
    order.date = new Date(parseInt(formObject["date"]) || "").toISOString();

    const basketItems = JSON.parse(formObject["basketItems"])
    console.log(order);
    console.log(basketItems);
  }

  const handleFormSubmit = (event: FormEvent<any>) => {
    event.preventDefault();
    handleSubmit(() => onSubmit(event))();
  }

  if (!user || !user.id) {
    return <Box>User not found</Box>;
  }

  if (isLoading) {
    return <Box>Loading</Box>;
  }

  if (!basket || !basket.items.length) {
    return (
      <Card
        minW={theme.sizes.minWidth}
        className={styles.container}
        marginY="20px"
        flexGrow={1}
      >
        <CardHeader>
          <Heading fontSize="3xl" fontWeight="semibold">
            Basket is empty
          </Heading>
        </CardHeader>
        <Divider />
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
          {isLoading ? <CircularProgress size="1em" isIndeterminate /> : <></>}
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
      </CardBody>

      <CardFooter marginRight={0} marginLeft="auto">
        <VStack>
          <Heading
            fontWeight="semibold"
            fontSize="xl"
            display="flex"
            flexDirection="row"
            >
            Subtotal ({basket.metadata && basket.metadata.total.quantity} items):
            <Text color={theme.colors.accent.tertiary} fontWeight="bold">
              {" "}
              {basket.metadata &&
                convertAndFormatToUserCurrency(basket.metadata.total.price, user)}
            </Text>
          </Heading>
        </VStack>
      </CardFooter>
    </Card>
    <form onSubmit={(event) => handleFormSubmit(event)}>

      <input id="usrId" name="usrId" type="hidden" value={user.id} />
      <input id="date" name="date" type="hidden" value={Date.now()} />
      <input id="currencyId" name="currencyId" type="hidden" value={user.currency.id} />
      {/** TO do: make set address and use it here */}
      <input id="addressId" name="addressId" type="hidden" value={1} />
      <input id="basketItems" name="basketItems" type="hidden" value={JSON.stringify(basket.items)} />
      <Button type="submit">Checkout</Button>
      
    </form>
    </>
  );
}
