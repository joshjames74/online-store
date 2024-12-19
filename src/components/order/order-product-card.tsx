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

  const wide = () => {
    return (
      <Box>
        <HStack justifyContent="space-between" alignItems="stretch">
          <HStack w="full">
            <Link href={`/product/${product.id}`}>
              <Box w="fit-content" h="fit-content" display="flex">
                <Image
                  h="70px"
                  w="100px"
                  objectFit="cover"
                  src={product.image_url}
                />
              </Box>
            </Link>
            <Stack w="fit-content">
              <Link href={`/product/${product.id}`}>
                <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">
                  {product.title}
                </Heading>
                <Text noOfLines={3} textOverflow="ellipsis" textAlign="justify">
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
      <Box>
        <HStack w="full">
          <Link href={`/product/${product.id}`}>
            <Box w="fit-content" h="fit-content" display="flex">
              <Image
                h="70px"
                w="100px"
                objectFit="cover"
                src={product.image_url}
              />
            </Box>
          </Link>
          <Stack w="fit-content">
            <Link href={`/product/${product.id}`}>
              <Heading
                textOverflow="ellipsis"
                noOfLines={2}
                fontSize="md"
                textAlign="justify"
              >
                {product.title}
              </Heading>
            </Link>
          </Stack>
        </HStack>
      </Box>
    );
  };

  return isLessThan500px ? compact() : wide();
}
