'use client';
import { getAllProducts, getProductById } from "@/api/request/productRequest";
import ProductWide from "@/components/product/product-wide";
import { Box } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import { useState, useEffect } from "react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css"


enum Width {
  wide = "WIDE",
  compact = "COMPACT"
}


export default function ProductGrid(): JSX.Element {

  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    getAllProducts().then((res: Product[]) => setProducts(res));
  }, [])

  const width: Width = Width.wide

  return ( products?.length ? 
    // <Box className={width === Width.compact ? styles.container_compact : styles.container_wide}>
    <Box className={styles.container_compact}>
        {/* {products.map((product: Product) => <ProductCompact key={product.id} {...product}/>)} */}
        {products.map((product: Product) => <ProductCompact key={product.id} {...product} />)}
    </Box> : <></>);
}