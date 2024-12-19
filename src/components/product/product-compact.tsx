import { ThemeContext } from "@/contexts/theme-context";
import Link from "next/link";
import {
  Avatar,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import ReviewStars from "../review/review-stars";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import { SettingsContext } from "@/contexts/settings-context";
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductCompact({
  ...product
}: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);

  return (
    <Link href={`/product/${product.id}`}>
      <Card w="180px">
        <CardBody>
          <Stack>
            <Image
              w="100%"
              h="150px"
              objectFit="cover"
              borderRadius="md"
              src={product.image_url}
            />
            <Heading noOfLines={1} fontSize="lg">
              {product.title}
            </Heading>
            <Heading fontSize="md" color={theme.colors.accent.tertiary}>
              {convertAndFormatToUserCurrency(product.price, currency)}
            </Heading>
            <HStack gap={1}>
              <Avatar name={product.seller?.name} size="2xs" />
              <ReviewStars value={product.review_score}></ReviewStars>
              <Text fontSize="xs" fontWeight="bold">
                {product.review_score.toPrecision(2).toString()}
              </Text>
              <Text fontSize="sm">({product.review_count})</Text>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
}
