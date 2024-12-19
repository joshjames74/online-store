"use client";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { postOrder } from "@/api/request/orderRequest";
import { Basket } from "@/api/services/basketItemService";
import { ThemeContext } from "@/contexts/theme-context";
import { useAddressState, useBasketState, useUserState } from "@/zustand/store";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Order } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function CheckoutPage({
  params,
}: {
  params: { basket: Basket };
}): JSX.Element {
  const { basket } = params;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const user = useUserState((state) => state.user);
  const currency = useUserState((state) => state.currency);
  const { theme } = useContext(ThemeContext);

  const addresses = useAddressState((state) => state.addresses);

  const fetchBasket = useBasketState((state) => state.fetchBasket);

  const toast = useToast();
  const router = useRouter();

  const [addressId, setAddressId] = useState<string>();

  const onSubmit = (event: FormEvent<any>) => {
    const pendingToast = toast({
      title: "Processing order",
      status: "loading",
      isClosable: true,
    });

    // get form data
    const element = event.target as HTMLFormElement;
    const data = new FormData(element);
    const formObject: Order = Object.fromEntries(data) as unknown as Order;
    // parse the data
    const order: Omit<Order, "id"> = {} as Order;
    order.addressId = formObject.addressId;
    order.currencyId = parseInt(formObject.currencyId.toString() || "");
    order.usrId = formObject.usrId;
    order.created_at = new Date(Date.now());

    // post the order
    postOrder({ order })
      .then((res) => {
        toast.update(pendingToast, {
          title: "Order saved successfully",
          status: "success",
          duration: 1000,
        });
        router.push("/user/orders");
      })
      .catch((error) => {
        console.error(error);
        toast.update(pendingToast, {
          title: "Error saving order",
          status: "error",
          duration: 5000,
        });
      })
      .finally(() => fetchBasket());
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(() => onSubmit(event))();
  };

  return (
    <>
      <Card w="md">
        <CardHeader paddingBottom={0}>
          <Heading fontSize="xl" w="full" textAlign="center">
            Order Summary
          </Heading>
        </CardHeader>

        <CardBody w="full">
          <Stack w="full" gap={"1em"}>
            <HStack justifyContent="space-between">
              <Heading fontSize="lg">Currency</Heading>
              {user.currencyId ? (
                <Text color={theme.colors.accent.tertiary} fontWeight="bold">
                  {currency.code}({currency.symbol})
                </Text>
              ) : (
                <Link href="/user/preferences/currency">
                  <Text color={theme.colors.semantic.error}>Set currency</Text>
                </Link>
              )}
            </HStack>

            <HStack justifyContent="space-between">
              <Heading fontSize="lg">Address</Heading>
              {addresses && addresses.length ? (
                <Stack>
                  <Select
                    placeholder="Select Address"
                    onChange={(event) => setAddressId(event.target.value)}
                  >
                    {addresses.map((address) => (
                      <option value={address.id} key={address.id}>
                        {address.address_line_1}
                        {", "}
                        {address.area_code}
                      </option>
                    ))}
                  </Select>
                </Stack>
              ) : (
                <Link href="/user/addresses/add">
                  <Text color={theme.colors.semantic.error}>Add address</Text>
                </Link>
              )}
            </HStack>

            <HStack justifyContent="space-between">
              <Heading fontSize="lg">Total</Heading>
              <Text fontWeight="bold" color={theme.colors.accent.tertiary}>
                {convertAndFormatToUserCurrency(
                  basket.metadata.total.price,
                  currency,
                )}
              </Text>
            </HStack>
          </Stack>
        </CardBody>

        <CardFooter justifyContent="right" paddingTop={0}>
          <form onSubmit={(event) => handleFormSubmit(event)}>
            <input id="usrId" name="usrId" type="hidden" value={user.id} />
            <input id="date" name="date" type="hidden" value={Date.now()} />
            <input
              id="currencyId"
              name="currencyId"
              type="hidden"
              value={user.currencyId || ""}
            />
            <input
              id="addressId"
              name="addressId"
              type="hidden"
              value={addressId}
            />

            <Button
              type="submit"
              isDisabled={!(!!addressId && !!user.currencyId)}
              bgColor={theme.colors.accent.primary}
            >
              Checkout
              <ArrowRightOutlined />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
