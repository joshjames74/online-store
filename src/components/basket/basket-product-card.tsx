import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { BasketItemWithProduct } from "@/api/services/basketItemService";
import { ThemeContext } from "@/contexts/theme-context";
import { useBasketState, useUserState } from "@/zustand/store";
import {
  CheckCircleFilled,
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

  const url = `/product/${basketItem.product.id}`
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);

  const [isLessThan700px] = useMediaQuery("(max-width: 700px)");
  const [isLessThan500px] = useMediaQuery("(max-width: 500px)");

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
      .catch((error) => console.error(error))
      .finally(() => setIsLoadingQuantity(false));
  };

  const handleDelete = () => {
    setIsLoadingDelete(true);
    deleteBasketItem(basketItem.id)
      .catch((error) => console.error(error))
      .finally(() => setIsLoadingDelete(false));
  };

  const handleStatus = () => {
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 1000);
  };



  const QuantityButton = (): JSX.Element => (
    <Button
      className="primary-button"
      justifyContent="space-evenly"
      alignItems="center"
      display="flex"
      padding="0.4em"
      h="30px"
      w="80px"
    >
      <MinusOutlined onClick={basketItem.quantity <= 1 ? () => {} : handleDecrementQuantity} />
      {isLoadingQuantity ? <CircularProgress isIndeterminate size="1em" /> : showStatus 
      ? <CheckCircleFilled color={theme.colors.semantic.success} /> 
        : <Text as="h6" color="inherit" margin="0">{basketItem.quantity}</Text>}
      <PlusOutlined onClick={handleIncrementQuantity} />
    </Button>
  );


  const DeleteButton = (): JSX.Element => (
    <Button
      className="primary-button"
      h="30px"
      w="80px"
      onClick={handleDelete}
      _hover={{ bgColor: "red !important" }}
      >
      Delete
      {isLoadingDelete 
      ? <CircularProgress size="1em" isIndeterminate />
      : <></>}
    </Button>
  );

  const PriceDiv = (): JSX.Element => (
    <Heading overflow="nowrap" as="h3">
      {convertAndFormatToUserCurrency(basketItem.product.price * basketItem.quantity, currency )}
    </Heading>
  );

  const MetaCardLarge = (): JSX.Element => (
    <Stack 
    w="100px"
    h="100%"
    justifyContent="flex-start"
    alignItems="flex-end">
      <PriceDiv />
      <QuantityButton />
      <DeleteButton />
    </Stack>
  );

  const MetaCardSmall = (): JSX.Element => (
    <Stack>
      <PriceDiv />
      <HStack alignItems="left">
        <QuantityButton />
        <DeleteButton />
      </HStack>
    </Stack>
  )

  const InfoCardLarge = (): JSX.Element => (
    <Stack h="full" w="full">
      <Link href={url}>
        <Heading as="h3" className="noOfLines-1">
          {basketItem.product.title}
        </Heading>
      </Link>
      <HStack>
          <ReviewStars value={basketItem.product.review_score} />
          <Text as="h5">{basketItem.product.review_count} Reviews</Text>
      </HStack>
      <Link href={url}>
        <Text className="noOfLines-3 justify" fontSize="inherit">
          {basketItem.product.description}
        </Text>
      </Link>  
    </Stack>
  );

  const InfoCardSmall = (): JSX.Element => (
    <Stack h="full" w="full">
      <Link href={url}>
        <Heading as="h4" className="noOfLines-1">
          {basketItem.product.title}
        </Heading>
      </Link>
      <HStack>
          <ReviewStars value={basketItem.product.review_score} />
          <Text as="h5">{basketItem.product.review_count} Reviews</Text>
      </HStack>
    </Stack>
  );




  return (
    <Card shadow="none" padding="0" maxW="5xl" minW="md">
      <HStack
        gap="0.4rem"
        w={isLessThan500px ? "200px" : "100%"}
        alignItems="flex-start"
        justifyContent="flex-start"
        height="fit-content"
        flexDirection={isLessThan500px ? "column" : "row"}
      >

        <Image
          src={basketItem.product.image_url}
          alt={basketItem.product.image_url}
          minW="200px"
          maxW="200px"
          height="120px"
          objectFit="cover"
        />

          {isLessThan700px 
          ?
          (
            <Stack>
              <InfoCardSmall />
              <MetaCardSmall />
            </Stack>
          )  
          :
          (
          <HStack h="100%" justifyContent="space-between" gap="0.3em" w="100%">
            <InfoCardLarge />
            <MetaCardLarge />
          </HStack>
          )
          }

      </HStack>
    </Card>
  );
}
