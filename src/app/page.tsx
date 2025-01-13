"use client";
import ProductGrid from "@/components/product/product-grid";
import Sidebar from "@/components/sidebar";
import { Box, HStack, Stack, useMediaQuery } from "@chakra-ui/react";
import SearchResultsInfo from "@/components/product/search-results-info";
import "@fontsource-variable/lora";
import "@fontsource-variable/inter";

const Page = () => {
  const [isLargerThan800px] = useMediaQuery("(max-width: 800px)");

  return (
    <>
      <title>Home</title>
      <Stack w="full">
        <SearchResultsInfo />
        {!isLargerThan800px ? (
          <HStack maxW="full" padding="1em" gap="1em" alignItems="stretch">
            <Sidebar />
            <ProductGrid />
          </HStack>
        ) : (
          <Stack maxW="full" padding="1em" gap="1em">
            <Sidebar />
            <ProductGrid />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default Page;
