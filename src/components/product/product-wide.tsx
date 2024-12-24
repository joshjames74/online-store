import { ThemeContext } from "@/contexts/theme-context";
import Link from "next/link";
import {
  Avatar,
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import ProductReviewBox from "./product-review-box";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductWide({
  ...product
}: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);

  return (
    <Link href={`/product/${product.id}`}>
      <Card maxW="min(2xl, 30%)" minW="100px" padding={0} shadow="none">
        <CardBody padding="0.4em" >
          <Grid templateColumns="minmax(150px, 1fr) 1fr" gap={2} w="full">
            <GridItem
              colSpan={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding={0}
            >
              <Image
                objectFit="contain"
                h="250px"
                w="auto"
                margin={0}
                borderRadius="md"
                src={product.image_url}
                alt={product.image_alt}
              />
            </GridItem>
            <GridItem colSpan={1} overflow="hidden" textOverflow="ellipsis">
              <Stack gap={1}>
                <Heading noOfLines={1} fontSize="2xl" w="full">
                  {product.title}
                </Heading>
                <ProductReviewBox {...product} />
                <HStack alignItems="center" gap="0.2em">
                  <Avatar name={product.seller?.name} size="2xs" />
                  <Heading fontSize="sm" fontWeight="medium">
                    {product.seller?.name}
                  </Heading>
                </HStack>
                <Heading fontSize="lg" color={theme.colors.accent.tertiary}>
                  {convertAndFormatToUserCurrency(product.price, currency)}
                </Heading>
                <Text
                  fontSize="xs"
                  noOfLines={6}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  textAlign="justify"
                >
                  {product.description}
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Link>
  );
}
