import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { BasketItemWithProduct } from "@/api/services/basketItemService";
import { SettingsContext } from "@/contexts/settings-context";
import { ThemeContext } from "@/contexts/theme-context";
import { useBasketState, useUserState } from "@/zustand/store";
import {
  CheckCircleFilled,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useState } from "react";
import ReviewStars from "../review/review-stars";

export default function BasketProductCard({
  basketItem,
}: {
  basketItem: BasketItemWithProduct;
}): JSX.Element {
  const { theme } = useContext(ThemeContext);

  const currency = useUserState((state) => state.currency);
  const { defaultImageUrl } = useContext(SettingsContext);

  const [isLessThan600px] = useMediaQuery("(max-width: 600px)");
  const [isLessThan350px] = useMediaQuery("(max-width: 350px)");

  // set vars relating to displaying success, error, and loading
  const [isLoadingQuantity, setIsLoadingQuantity] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const putBasketItem = useBasketState((state) => state.putBasketItem);
  const deleteBasketItem = useBasketState((state) => state.deleteBasketItem);

  // increment product quantity
  const handleIncrementQuantity = () => updateQuantity(1);
  const handleDecrementQuantity = () => updateQuantity(-1);

  const updateQuantity = (quantity: number) => {
    setIsLoadingQuantity(true);
    const newQuantity = Math.max(basketItem.quantity + quantity, 0);
    putBasketItem(basketItem.id, newQuantity)
      .catch(error => console.error(error))
      .finally(() => setIsLoadingQuantity(false));
  };

  const handleDelete = () => {
    setIsLoadingDelete(true);
    deleteBasketItem(basketItem.id)
      .catch(error => console.error(error))
      .finally(() => setIsLoadingDelete(false));
  };

  const handleStatus = () => {
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 1000);
  };


  return (
    <Card>
    <HStack
      gap="0.4em"
      padding="1em"
      w="full"
      alignItems="center"
      justifyContent="space-between"
      
      height="100px"
      >
      <Image 
        src={basketItem.product.image_url}
        alt={basketItem.product.image_url}
        width="200px"
        minW="200px"
        height="80px"
        objectFit="contain"
      />

      <Stack 
      w="full"
      flexDirection={isLessThan600px ? "column" : "row"}
      justifyContent="space-between">

        <Link href={basketItem.product.url || ""}>
          <HStack gap="1em">
                <Stack>
                  <Heading fontSize="xl" noOfLines={1} textOverflow="ellipsis">{basketItem.product.title}</Heading>
                  <ReviewStars value={basketItem.product.review_score} />
                </Stack>
          </HStack>
        </Link>

        <Stack>
          <Heading
            overflow="nowrap"
            fontSize="lg"
            color={theme.colors.accent.tertiary}
          >
            {convertAndFormatToUserCurrency(
              basketItem.product.price * basketItem.quantity,
              currency,
            )}
          </Heading>

          <HStack>
            <HStack
              as={Button}
              gap={5}
              h="fit-content"
              padding="0.4em"
              fontSize="xs"
            >
              <MinusOutlined onClick={handleDecrementQuantity} />
              {isLoadingQuantity ? (
                <CircularProgress isIndeterminate size="1em" />
              ) : showStatus ? (
                <Box color={theme.colors.semantic.success}>
                  <CheckCircleFilled />
                </Box>
              ) : (
                <Text>{basketItem.quantity}</Text>
              )}
              <PlusOutlined onClick={handleIncrementQuantity} />
            </HStack>
            <Text
              fontSize="xs"
              fill={theme.colors.semantic.error}
              _hover={{
                color: theme.colors.text.focus,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={handleDelete}
              >
              <DeleteOutlined />{" "}
              {isLoadingDelete ? (
                <CircularProgress size="1em" isIndeterminate />
              ) : (
                <></>
              )}
            </Text>
          </HStack>
        </Stack>
      </Stack>
    </HStack>
    </Card>
  );
}
