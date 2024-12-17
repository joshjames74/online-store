import { OrderItemView, OrderWithMetadata } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import OrderProductCard from "./order-product-card";
import {
  convertAndFormatToUserCurrency,
  formatDate,
} from "@/api/helpers/utils";
import styles from "./order-card.module.css";
import { useUserState } from "@/zustand/store";
import AddressCard from "../navigation/delivery-button/address-card";
import Link from "next/link";

export default function OrderCard({
  params,
}: {
  params: { orderView: OrderWithMetadata };
}): JSX.Element {
  const { orderView } = params;
  const { theme } = useContext(ThemeContext);

  const currency = useUserState((state) => state.currency);

  if (!orderView) {
    return <></>;
  }

  return (
    <Card className={styles.container} borderRadius="0.4em">
      <CardHeader bgColor={theme.colors.background.secondary} padding="1em">
        <HStack className={styles.header_container}>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="sm">
              ORDER PLACED
            </Heading>
            <Heading className={styles.value} fontSize="sm">
              {formatDate(orderView.order.date.toString())}
            </Heading>
          </Stack>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="sm">
              TOTAL
            </Heading>
            <Heading className={styles.value} fontSize="sm">
              {convertAndFormatToUserCurrency(
                orderView.metadata.total.price,
                currency,
              )}
            </Heading>
          </Stack>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="sm">
              DISPATCHED TO
            </Heading>
            <Popover>
              <PopoverTrigger>
                <Heading 
                className={styles.value}
                fontSize="sm"
                color={theme.colors.accent.primary}
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}>
                  {orderView.order.address.name}
                </Heading>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <PopoverHeader>
                    {orderView.order.address.name}
                  </PopoverHeader>
                  <PopoverBody>
                    <Text>{orderView.order.address.address_line_1}</Text>
                    <Text>{orderView.order.address.address_line_2}</Text>
                    <Text>{orderView.order.address.area_code}</Text>
                  </PopoverBody>
                  <PopoverFooter>
                    <Link href="/user/addresses">
                      <Text>Manage Addresses</Text>
                    </Link>
                  </PopoverFooter>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
        </HStack>
      </CardHeader>

      <CardBody>
        <Stack>
          {orderView.order.orderItem.map(
            (item: OrderItemView, index: number) => (
              <OrderProductCard {...item.product} key={index} />
            ),
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
