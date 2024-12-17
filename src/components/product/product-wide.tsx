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
import { SettingsContext } from "@/contexts/settings-context";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductWide({
  ...product
}: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);
  const { defaultImageUrl } = useContext(SettingsContext);

  return (
    <Link href={`/product/${product.id}`}>
      <Card w="2xl" minW={theme.sizes.minWidth}>
        <CardBody>
          <Grid templateColumns="minmax(150px, 1fr) 1fr" gap={2} w="full">
            <GridItem
              colSpan={1}
              bgColor={theme.colors.background.secondary}
              display="flex"
              padding="0.4em"
              borderRadius="1em"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                objectFit="contain"
                h="250px"
                w="100%"
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
