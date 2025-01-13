"use client";
import { ProductWithSeller } from "@/api/services/productService";
import {
  Box,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";

export default function OrderProductCard(
  product: ProductWithSeller,
): JSX.Element {
  const [isLessThan500px] = useMediaQuery("(max-width: 500px)");

  const url = `/product/${product.id}`;

  const wide = () => {
    return (
      <Box>
        <HStack justifyContent="space-between" alignItems="stretch">
          <HStack w="full">
            <Link href={url}>
              <Image
                h="70px"
                minW="150px"
                maxW="150px"
                objectFit="cover"
                src={product.image_url}
              />
            </Link>
            <Stack w="fit-content">
              <Link href={url}>
                <Heading className="noOfLines-1" as="h4">
                  {product.title}
                </Heading>
                <Text className="noOfLines-3 justify">
                  {product.description}
                </Text>
              </Link>
            </Stack>
          </HStack>
        </HStack>
      </Box>
    );
  };

  const compact = () => {
    return (
      <HStack w="fit-content" flexDirection="column" alignItems="flex-start">
        <Link href={url}>
          <Image
            h="100px"
            w="200px"
            objectFit="cover"
            src={product.image_url}
          />
        </Link>
        <Stack w="fit-content">
          <Link href={url}>
            <Heading as="h4" className="noOfLine-1">
              {product.title}
            </Heading>
          </Link>
        </Stack>
      </HStack>
    );
  };

  return isLessThan500px ? compact() : wide();
}
