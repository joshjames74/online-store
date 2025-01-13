"use client";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import OrderCard from "./order-card";
import Link from "next/link";
import { useOrderSearchStore, useUserState } from "@/zustand/store";
import PageNumberGrid from "../basket/pagination/page-number-grid";

export default function OrderPage(): JSX.Element {
  const [isLessThan900px] = useMediaQuery("(max-width: 800px)");

  const user = useUserState((state) => state.user);
  const id = user.id;

  const orders = useOrderSearchStore((state) => state.orders);
  const params = useOrderSearchStore((state) => state.params);
  const isLoading = useOrderSearchStore((state) => state.isLoading);
  const maxPages = useOrderSearchStore((state) => state.maxPages);
  const pageNumber = params.pageNumber || 1;

  const updateUserId = useOrderSearchStore((state) => state.updateUserId);
  const updateOrderFilter = useOrderSearchStore(
    (state) => state.updateOrderFilter,
  );
  const updateMinDate = useOrderSearchStore((state) => state.updateMinDate);
  const updateMaxDate = useOrderSearchStore((state) => state.updateMaxDate);
  const updatePageNumber = useOrderSearchStore(
    (state) => state.updatePageNumber,
  );
  const resetDate = useOrderSearchStore((state) => state.resetDate);

  const [showCustom, setShowCustom] = useState<boolean>(false);

  const getDateMinusDays = (days: number): Date => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);
    return pastDate;
  };

  const getDateFromEvent = (
    event: ChangeEvent<HTMLInputElement>,
  ): Date | void => {
    const value = event.target.value;
    if (!value) return;
    const date = new Date(value);
    return date;
  };

  const handleChangeFilter = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = parseInt(event.target.value);
    updateOrderFilter(value);
  };

  const handleDateChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = parseInt(event.target.value);
    if (!value || isNaN(value)) {
      return;
    }

    if (value === -1) {
      resetDate();
      setShowCustom(true);
      return;
    }
    // if not using custom date, make sure date is reset
    setShowCustom(false);
    resetDate();

    const date = getDateMinusDays(value);
    updateMinDate(date);
  };

  const handleChangeMinDate = (event: ChangeEvent<HTMLInputElement>): void => {
    const date = getDateFromEvent(event);
    if (!date) return;
    updateMinDate(date);
  };

  const handleChangeMaxDate = (event: ChangeEvent<HTMLInputElement>): void => {
    const date = getDateFromEvent(event);
    if (!date) return;
    updateMaxDate(date);
  };

  useEffect(() => {
    if (!id) return;
    updateUserId(id);
  }, [id]);

  return (
    <Stack
      alignItems="center"
      padding="1em"
      maxWidth="4xl"
      minW="300px"
      mx="auto"
    >
      <Box w="full">
        <Breadcrumb separator=">">
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/account">Your Account</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage={true}>
            <BreadcrumbLink>Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" marginY="0.4em">
          Your Orders
        </Heading>

        <HStack
          display="flex"
          flexDirection={isLessThan900px ? "column" : "row"}
          alignItems="left !important"
        >
          <Select
            placeholder="Order By"
            onChange={(event) => handleChangeFilter(event)}
            w="200px"
          >
            <option value={1}>Date: Recent - Old</option>
            <option value={2}>Date: Old - Recent</option>
          </Select>
          <Select
            placeholder="Date range"
            onChange={(event) => handleDateChange(event)}
            w="200px"
          >
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
            <option value={-1}>Custom</option>
          </Select>
          <HStack
            visibility={showCustom ? "visible" : "hidden"}
            display={showCustom ? "flex" : "none"}
            flexDirection={isLessThan900px ? "column" : "row"}
            alignItems="left !important"
          >
            <Input
              type="datetime-local"
              onChange={(event) => handleChangeMinDate(event)}
              w="200px"
              className="primary-border"
            />
            {isLessThan900px ? <></> : <span>-</span>}
            <Input
              type="datetime-local"
              onChange={(event) => handleChangeMaxDate(event)}
              w="200px"
              className="primary-border"
            />
          </HStack>
        </HStack>

        {isLoading ? (
          <Box marginTop="1em">
            <Spinner />
          </Box>
        ) : (
          <Stack marginTop="1em" gap="1em">
            {orders.length ? (
              orders.map((orderView, index) => (
                <OrderCard params={{ orderView: orderView }} key={index} />
              ))
            ) : (
              <Stack textAlign="center" w="full" marginTop="1em">
                <Text>No orders</Text>
                <Link href="/">
                  <Text>Click here to continue shopping</Text>
                </Link>
              </Stack>
            )}
          </Stack>
        )}
        {PageNumberGrid({
          params: {
            pageNumber: pageNumber,
            onClickPageNumber: updatePageNumber,
            maxPages: maxPages,
          },
        })}
      </Box>
    </Stack>
  );
}
