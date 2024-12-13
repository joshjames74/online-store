import { OrderWithMetadata } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useContext } from "react";
import OrderProductCard from "./order-product-card";
import {
  convertAndFormatToUserCurrency,
  formatDate,
} from "@/api/helpers/utils";
import { ResultType } from "@/api/helpers/types";
import styles from "./order-card.module.css";
import { useUserState } from "@/zustand/store";

export default function OrderCard({
  params,
}: {
  params: { orderView: OrderWithMetadata };
}): JSX.Element {
  const { orderView } = params;
  const { theme } = useContext(ThemeContext);

  const currency = useUserState((state) => state.currency);

  type OrderItemView = ResultType<
    "orderItem",
    { product: { include: { seller: true } } }
  >;

  const a: OrderItemView = {} as OrderItemView;

  if (!orderView) {
    return <></>;
  }

  return (
    <Card className={styles.container} borderRadius="1em" overflow="hidden">
      <CardHeader bgColor={theme.colors.background.secondary} padding="1em">
        <HStack className={styles.header_container}>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="md">
              ORDER PLACED
            </Heading>
            <Heading className={styles.value} fontSize="md">
              {formatDate(orderView.order.date.toString())}
            </Heading>
          </Stack>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="md">
              TOTAL
            </Heading>
            <Heading className={styles.value} fontSize="md">
              {convertAndFormatToUserCurrency(
                orderView.metadata.total.price,
                currency,
              )}
            </Heading>
          </Stack>
          <Stack className={styles.info_container}>
            <Heading className={styles.label} fontSize="md">
              DISPATCHED TO
            </Heading>
            <Heading className={styles.value} fontSize="md">
              {orderView.order.address.name}
            </Heading>
          </Stack>
        </HStack>
      </CardHeader>

      <Divider />

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
