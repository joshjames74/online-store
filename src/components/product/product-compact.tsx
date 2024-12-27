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
import { useUserState } from "@/zustand/store";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductCompact({
  ...product
}: ProductWithSeller): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const currency = useUserState((state) => state.currency);
  const url = `/product/${product.id}`;
  const reviewUrl = `${url}#reviews`;

  return (
    <Card w="220px" padding={0} shadow="none">
      <CardBody padding={0}>
        <Stack>
          <Link href={url}>
            <Image
              w="100%"
              h="250px"
              objectFit="contain"
              borderRadius="md"
              src={product.image_url}
            />
          </Link>

          <Link href={url}>
            <Heading as="h3" className="noOfLines-2" h="45px">
              {product.title}
            </Heading>
          </Link>

          <Heading as="h4" className="noOfLines-2 muted-heading">
            {product.seller.name}
          </Heading>

          <Heading as="h4">
            {convertAndFormatToUserCurrency(product.price, currency)}
          </Heading>

          <Link href={reviewUrl}>
            <HStack alignItems="center">
              <ReviewStars value={product.review_score} fontSize="md" />
              <Heading as="h4">{product.review_count} Reviews</Heading>
            </HStack>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  );
}
