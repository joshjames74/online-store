'use client';
import NavBar from "@/components/navigation";
import ProductGrid from "@/components/product/product-grid";
import Sidebar from "@/components/sidebar";
import { Box } from "@chakra-ui/react";
import styles from "./page.module.css"
import { ThemeContext } from "@emotion/react";
import { useContext } from "react";
import ProductReviewBox from "@/components/product/product-review-box";
import SearchResultsInfo from "@/components/product/search-results-info";

const Page = () => {

  const showing = 10;
  const total = 1000;

  return ( 
    <Box 
    className={styles.container}
    fontFamily={"Montserrat"}>
      <SearchResultsInfo showing={showing} total={total} />
      <Box className={styles.product_area_container}>
        <Sidebar />
        <ProductGrid />
      </Box>
    </Box>
  );
}

export default Page;