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
import { ThemeContext } from "@/contexts/theme-context";
import { useContext } from "react";
import ReviewStars from "../review/review-stars";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import ProductBasketCard from "./product-basket-card";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";
import Link from "next/link";

export default function ProductPage(product: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);

  return (
    <Card
      alignItems="stretch"
      minW={theme.sizes.minWidth}
      maxW="5xl"
      w="full"
      shadow={"none"}
    >
      <CardBody padding={0}>
        <HStack
          h="full"
          alignItems="stretch"
          sx={{
            "@media screen and (max-width: 800px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            alignItems="center"
            justifyContent="center"
            display="flex"
            borderRadius="0.2em"
            height="fit-content"
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
            <Heading as="h1" className="noOfLines-2">
              {product.title}
            </Heading>
            <Heading as="h3" className="noOfLines-1 muted-heading">
              {product.seller?.name}
            </Heading>
            <Link href="#reviews">
              <HStack>
                <ReviewStars fontSize="lg" value={product.review_score} />
                <Heading as="h3">{product.review_count} Reviews</Heading>
              </HStack>
            </Link>
            <HStack w="full" justifyContent="left">
              <ProductBasketCard props={{ id: product.id }} />
            </HStack>
            <Heading as="h2">
              {convertAndFormatToUserCurrency(product.price, currency)}
            </Heading>
            <Text className="justify">{product.description}</Text>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  );
}
