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
  CircularProgress,
  Heading,
  HStack,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useState } from "react";

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

  const updateQuantity = async (quantity: number) => {
    setIsLoadingQuantity(true);
    const newQuantity = Math.max(basketItem.quantity + quantity, 0);
    await putBasketItem(basketItem.id, newQuantity);
    setIsLoadingQuantity(false);
  };

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    await deleteBasketItem(basketItem.id);
    setIsLoadingDelete(false);
  };

  const handleStatus = () => {
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 1000);
  };

  // return (
  //     <HStack gap="0.4em" padding="0.4em" maxH="140px" h="fit-content" alignItems="stretch" flexDirection={isLessThan600px ? "column" : "row"}>

  //         <Image h="100px" w="auto" objectFit="cover" borderRadius="md" src={defaultImageUrl} />

  //         <Grid templateColumns="3fr 1fr" templateRows="3fr 1fr" w="100%" overflow="hidden">
  //             <GridItem colStart={1} colEnd={1} maxH="fit-content">
  //                 <Stack w="full">
  //                     <Heading fontSize="lg">{basketItem.product.title}</Heading>
  //                     <Text noOfLines={2} overflow="hidden" textOverflow="ellipsis" display={isLessThan600px ? "none" : "inline"}>
  //                         {basketItem.product.description}
  //                     </Text>
  //                 </Stack>
  //             </GridItem>

  //             <GridItem colStart={2} rowStart={1}>
  //                 <Heading
  //                     marginLeft="auto"
  //                     marginRight={0}
  //                     maxW="fit-content"
  //                     overflow="nowrap"
  //                     fontSize="lg"
  //                     color={theme.colors.accent.tertiary}>
  //                     {getProductPrice(basketItem.product.price * basketItem.quantity, basketItem.product.currency.gbp_exchange_rate,  user)}
  //                 </Heading>
  //             </GridItem>

  //             <GridItem colStart={1} rowStart={2}>
  //                 <HStack>
  //                     <HStack as={Button} gap={5} h="fit-content" padding="0.4em" fontSize="xs">
  //                         <MinusOutlined onClick={handleDecrementQuantity} />
  //                         {isLoadingQuantity
  //                         ? <CircularProgress isIndeterminate size="1em" />
  //                         : showStatus
  //                             ? <Box color={theme.colors.semantic.success}><CheckCircleFilled /></Box>
  //                             : <Text>{basketItem.quantity}</Text>}
  //                         <PlusOutlined onClick={handleIncrementQuantity} />
  //                     </HStack>
  //                     <Text
  //                         fontSize="xs"
  //                         fill={theme.colors.semantic.error}
  //                         _hover={{ color: theme.colors.text.focus, textDecoration: 'underline', cursor: "pointer" }}
  //                         onClick={handleDelete}
  //                         >
  //                             <DeleteOutlined /> {isLoadingDelete ? <CircularProgress size="1em" isIndeterminate /> : <></>}
  //                     </Text>
  //                 </HStack>
  //             </GridItem>

  //         </Grid>

  //     </HStack>
  // )
  return (
    <HStack
      gap="0.4em"
      padding="0.4em"
      w="full"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={isLessThan350px ? "column" : "row"}
    >
      {/* {isLessThan600px ? (
        <ProductCompact {...basketItem.product} />
      ) : (
        <ProductWide {...basketItem.product} />
      )} */}
      <Heading>{basketItem.product.title}</Heading>

      <Stack>
        <Heading
          marginLeft="auto"
          marginRight={0}
          maxW="fit-content"
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
    </HStack>
  );

  // return (
  //     <HStack gap="0.4em" padding="0.4em" maxH="100px" alignItems="stretch">

  //         <Image h="100px" w="auto" objectFit="cover" borderRadius="md" src={defaultImageUrl} />

  //         <HStack w="100%" justifyContent="space-between">

  //             <Stack alignItems="stretch" h="full">
  //                 <Heading fontSize="lg">{basketItem.product.title}</Heading>
  //                 <Text noOfLines={1} textOverflow="ellipsis">{basketItem.product.description}</Text>
  //             </Stack>

  //             <Stack h="full" justifyContent="right" border="1px solid black">

  //                 <Heading
  //                     marginLeft="auto"
  //                     marginRight={0}
  //                     maxW="fit-content"
  //                     overflow="nowrap"
  //                     fontSize="lg"
  //                     color={theme.colors.accent.tertiary}>
  //                     {getProductPrice(basketItem.product.price * basketItem.quantity, basketItem.product.currency.gbp_exchange_rate,  user)}
  //                 </Heading>

  //                 <HStack as={Button} gap={5} h="fit-content" padding="0.4em" w="fit-content">
  //                     <MinusOutlined onClick={handleDecrementQuantity} />
  //                     {isLoadingQuantity
  //                     ? <CircularProgress isIndeterminate size="1em" />
  //                     : showStatus
  //                     ? <Box color={theme.colors.semantic.success}><CheckCircleFilled /></Box>
  //                     : <Text>{basketItem.quantity}</Text>}
  //                     <PlusOutlined onClick={handleIncrementQuantity} />
  //                 </HStack>

  //                 <Text
  //                 fill={theme.colors.semantic.error}
  //                 _hover={{ color: theme.colors.text.focus, textDecoration: 'underline', cursor: "pointer" }}
  //                 onClick={handleDelete}>
  //                     <DeleteOutlined /> {isLoadingDelete ? <CircularProgress size="1em" isIndeterminate /> : <></>}
  //                 </Text>

  //             </Stack>
  //         </HStack>

  //     </HStack>
  // )
}
