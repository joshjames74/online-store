"use client";
import { ResultType } from "@/api/helpers/types.module";
import { SettingsContext } from "@/contexts/settings-context";
import { ThemeContext } from "@/contexts/theme-context";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function OrderProductCard(
  product: ResultType<"product", { currency: true }>,
): JSX.Element {
  const { defaultImageUrl } = useContext(SettingsContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [isLessThan500px] = useMediaQuery("(max-width: 500px)");

  const reviewButton = () => {
    return (
      <Text
        fontSize="xs"
        _hover={{ textDecoration: "underline" }}
        onClick={() => router.push(`/product/${product.id}#reviews`)}
      >
        Write a review
      </Text>
    );
  };

  const wide = () => {
    return (
      <Box>
        <HStack justifyContent="space-between" alignItems="stretch">
          <HStack alignItems="stretch">
            <Image h="70px" w="auto" src={defaultImageUrl} />
            <Stack>
              <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">
                {product.title}
              </Heading>
              <Text noOfLines={3} textOverflow="ellipsis">
                {product.description}
              </Text>
            </Stack>
          </HStack>
          {reviewButton()}
        </HStack>
      </Box>
    );
  };

  const compact = () => {
    return (
      <Box>
        <HStack w="full">
          <Image h="70px" w="auto" src={defaultImageUrl} />
          <Stack>
            <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">
              {product.title}
            </Heading>
            {reviewButton()}
          </Stack>
        </HStack>
      </Box>
    );
  };

  return isLessThan500px ? compact() : wide();
}
