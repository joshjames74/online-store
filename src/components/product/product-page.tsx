"use client";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import styles from "./product-page.module.css";
import { ThemeContext } from "@/contexts/theme-context";
import { useContext } from "react";
import ReviewStars from "../review/review-stars";
import {
  convertAndFormatToUserCurrency,
  formatReviewScore,
} from "@/api/helpers/utils";
import ProductBasketCard from "./product-basket-card";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductPage(product: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);

  return (
    <HStack alignItems="stretch" className={styles.container} gap="1em">
      <Card
        minW={theme.sizes.minWidth}
        maxW="5xl"
        w="full"
        className={styles.product_container}
        shadow={"none"}
      >
        <CardBody>
          <HStack
            h="full"
            alignItems="stretch"
            sx={{
              "@media screen and (max-width: 1000px)": {
                flexDirection: "column",
              },
            }}
          >
            <Box
              bgColor={theme.colors.background.secondary}
              alignItems="center"
              justifyContent="center"
              display="flex"
              padding="1em"
              borderRadius="0.2em"
              height="fit-content"
              marginRight="0.4em"
            >
              <Image
                height="min(400px, 50vw)"
                width="600px"
                objectFit="contain"
                borderRadius="md"
                src={product.image_url}
              />
            </Box>
            <Stack w="full">
              <Heading>{product.title}</Heading>
              <HStack
                className={styles.review_container}
                fontSize="lg"
                fontWeight="medium"
              >
                <Text>{formatReviewScore(product.review_score)}</Text>
                <ReviewStars fontSize="lg" value={product.review_score} />
                <a href="#reviews">
                  <Text
                    className={styles.ratings_link}
                    _hover={{ color: theme.colors.accent.primary }}
                  >
                    {product.review_count} ratings
                  </Text>
                </a>
              </HStack>
              <HStack>
                <Avatar name={product.seller?.name} size="xs" />
                <Text fontSize="md">{product.seller?.name}</Text>
              </HStack>
              <Heading
                fontSize="3xl"
                fontWeight="semibold"
                color={theme.colors.accent.tertiary}
              >
                {convertAndFormatToUserCurrency(product.price, currency)}
              </Heading>
              <Text textAlign="justify">{product.description}</Text>
            </Stack>
          </HStack>
        </CardBody>
      </Card>
      <ProductBasketCard props={{ id: product.id }} />
    </HStack>
  );
}
