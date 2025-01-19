"use client";
import ProductWide from "@/components/product/product-wide";
import { Box, Card, CardBody, Heading, Spinner, Stack } from "@chakra-ui/react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css";
import PageNumberGrid from "../basket/pagination/page-number-grid";
import { Width } from "@/api/transformers/productSearchTransformer";
import { ProductWithSeller } from "@/api/services/productService";
import { useEffect } from "react";
import { selectMainProductFilters, selectMainProducts } from "@/redux/selectors";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, setMainProductPageNumber } from "@/redux/store";
import { fetchMainProducts } from "@/redux/actions/products";


export default function ProductGrid(): JSX.Element {


  // redux
  const dispatch = useDispatch<AppDispatch>();

  const results = useSelector(selectMainProducts);
  const filters = useSelector(selectMainProductFilters);

  const fetchProducts = () => dispatch(fetchMainProducts());
  const updatePageNumber = (pageNumber: number) => dispatch(setMainProductPageNumber(pageNumber));
  

  //const maxPages = useSearchResultsState((state) => state.maxPages);
  const maxPages = 20;

  // update page number, reload products, refresh
  const handleClickPageNumber = (pageNumber: number) => {
    updatePageNumber(pageNumber);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  
  if (results.isLoading) {
    return <Spinner />;
  };

  if (!results?.products?.length) {
    return (
      <Card shadow="none">
        <CardBody>
          <Heading as="h3">No products found</Heading>
        </CardBody>
      </Card>
    );
  }

  if (filters.perPage === Width.WIDE) {
    return (
      <Stack w="full">
        <Stack>
          {results.products.map((product: ProductWithSeller) => (
            <ProductWide key={product.id} {...product} />
          ))}
        </Stack>
        <PageNumberGrid
          params={{
            pageNumber: filters.pageNumber || 0,
            onClickPageNumber: handleClickPageNumber,
            maxPages: maxPages,
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack w="100%" maxW="2000px">
      <Box className={styles.container_compact} alignItems="flex-start">
        {results.products.map((product: ProductWithSeller) => (
          <ProductCompact key={product.id} {...product} />
        ))}
      </Box>
      <PageNumberGrid
        params={{
          pageNumber: filters.pageNumber || 0,
          onClickPageNumber: handleClickPageNumber,
          maxPages: maxPages,
        }}
      />
    </Stack>
  );
}
