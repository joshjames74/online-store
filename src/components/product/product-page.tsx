"use client";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  Divider,
  Heading,
  HStack,
  Image,
  Select,
  Skeleton,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { Product } from "@prisma/client";
import styles from "./product-page.module.css";
import { ThemeContext } from "@/contexts/theme-context";
import { useContext, useEffect, useState } from "react";
import ReviewStars from "../review/review-stars";
import { postBasketItem } from "@/api/request/basketRequest";
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { UserContext } from "@/contexts/user-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { convertAndFormatToUserCurrency, formatReviewScore } from "@/api/helpers/utils";
import { ResultType } from "@/api/helpers/types";
import ProductBasketCard from "./product-basket-card";

export default function ProductPage(
  product: ResultType<"product", { }>,
): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  // define success/error message params
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <HStack
      margin="20px"
      alignItems="stretch"
      className={styles.container}
      gap="1em"
    >
      {/** Product info */}

      <Card
        minW={theme.sizes.minWidth}
        maxW="5xl"
        w="full"
        className={styles.product_container}
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
              borderRadius="0.4em"
            >
              <Image
                minW="300px"
                h="auto"
                objectFit="contain"
                borderRadius="md"
                src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"
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
              <Divider
                w="100%"
                className={styles.divider}
                bgColor={theme.colors.border.background}
              />
              <Heading
                fontSize="3xl"
                fontWeight="semibold"
                color={theme.colors.accent.tertiary}
              >
                {convertAndFormatToUserCurrency(
                  product.price,
                  user,
                )}
              </Heading>
              <Text>{product.description}</Text>
            </Stack>
          </HStack>
        </CardBody>
      </Card>
      <ProductBasketCard props={{ id: product.id }} />
    </HStack>
  );
}
