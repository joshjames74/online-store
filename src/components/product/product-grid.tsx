"use client";
import ProductWide from "@/components/product/product-wide";
import { Box, Card, CardBody, Heading } from "@chakra-ui/react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css";
import { useSearchParamsState, useSearchResultsState } from "@/zustand/store";
import PageNumberGrid from "../basket/pagination/page-number-grid";
import { useRouter } from "next/navigation";
import { Width } from "@/api/transformers/productSearchTransformer";
import { ProductWithSeller } from "@/api/services/productService";

export default function ProductGrid(): JSX.Element {
  const router = useRouter();

  const results = useSearchResultsState((state) => state.results);
  const maxPages = useSearchResultsState((state) => state.maxPages);
  const params = useSearchParamsState((state) => state.params);

  const updatePageNumber = useSearchParamsState(
    (state) => state.updatePageNumber,
  );
  const executeSearch = useSearchParamsState((state) => state.executeSearch);

  // update page number, reload products, refresh
  const handleClickPageNumber = (pageNumber: number) => {
    updatePageNumber(pageNumber);
    executeSearch();
    router.push("/");
  };

  if (!results.data?.length) {
    return (
      <Card className={styles.wrapper} h="fit-content">
        <CardBody>
          <Heading fontSize="md">No products found</Heading>
        </CardBody>
      </Card>
    );
  }

  if (params.perPage === Width.WIDE) {
    return (
      <Box className={styles.wrapper}>
        <Box className={styles.container_wide}>
          {results.data.map((product: ProductWithSeller) => (
            <ProductWide key={product.id} {...product} />
          ))}
        </Box>
        <PageNumberGrid
          params={{
            pageNumber: params.pageNumber || 0,
            onClickPageNumber: handleClickPageNumber,
            maxPages: maxPages,
          }}
        />
      </Box>
    );
  }

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.container_compact}>
        {results.data.map((product: ProductWithSeller) => (
          <ProductCompact key={product.id} {...product} />
        ))}
      </Box>
      <PageNumberGrid
        params={{
          pageNumber: params.pageNumber || 0,
          onClickPageNumber: handleClickPageNumber,
          maxPages: maxPages,
        }}
      />
    </Box>
  );
}
