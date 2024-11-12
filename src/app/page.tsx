'use client';
import ProductGrid from "@/components/product/product-grid";
import Sidebar from "@/components/sidebar";
import { Box } from "@chakra-ui/react";
import styles from "./page.module.css"
import SearchResultsInfo from "@/components/product/search-results-info";
import { useSearchParams } from "next/navigation";
import { useSearchStore } from "@/zustand/store";
import { parseQueryParams } from "@/api/helpers/utils";
import { useEffect, useState } from "react";
import { getProductsBySearchParams } from "@/api/request/productRequest";

const Page = () => {

  const searchParams = useSearchParams();
  
  const params = useSearchStore((state) => state.params);
  const setParams = useSearchStore((state) => state.setParams);
  const resultsCount = useSearchStore((state) => state.resultsCount);
  const setResultsCount = useSearchStore((state) => state.setResultsCount);

  const [perPage, setPerPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const fetchData = () => {
    const parsedParams = parseQueryParams(searchParams);
    if (!parsedParams.pageNumber) { parsedParams.pageNumber = 1 };
    if (!parsedParams.perPage) { parsedParams.perPage = 20 };
    setParams(parsedParams);

    // set results count
    const { perPage, pageNumber, ...searchParamsWithoutPagination } = params;
    getProductsBySearchParams(searchParamsWithoutPagination, "reload").then(res => setResultsCount(res.metadata?.count || 0));

    // set pagination info
    setPageNumber(params.pageNumber || 1);
    setPerPage(params.perPage || 1);
  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return ( 
    <Box 
    className={styles.container}
    fontFamily={"Montserrat"}>
      <SearchResultsInfo showing={(pageNumber - 1) * perPage + 1} total={resultsCount} />
      <Box className={styles.product_area_container}>
        <Sidebar />
        <ProductGrid />
      </Box>
    </Box>
  );
}

export default Page;