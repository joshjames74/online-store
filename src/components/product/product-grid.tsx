'use client';
import { getAllProducts, getProductsBySearchParams } from "@/api/request/productRequest";
import ProductWide from "@/components/product/product-wide";
import { Box } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import { useState, useEffect } from "react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css";
import { useSearchParams } from "next/navigation";
import { parseQueryParams } from "@/api/helpers/utils";
import ProductWideSkeleton from "./product-wide-skeleton";
import ProductCompactSkeleton from "./product-compact-skeleton";


enum Width {
  wide = "WIDE",
  compact = "COMPACT"
}


export default function ProductGrid(): JSX.Element {


  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>();
  const [width, setWidth] = useState<Width>(Width.compact);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  
  // load categories
  
  useEffect(() => {
    
    const searchData = parseQueryParams(searchParams);

    setIsLoading(true);
    getProductsBySearchParams(searchData).then((res: Product[]) => {
        setProducts(res)
        setIsLoading(false);
    });
  }, [searchParams]);


  
  // skeleton 

  const renderWideSkeleton = () => {
    return (
    <Box className={styles.container_wide}>
      {Array.from({ length: 20 }).map(() => <ProductWideSkeleton />)}
    </Box>
    )
  };

  const renderCompactSkeleton = () => {
    return (
      <Box className={styles.container_compact}>
        {Array.from({ length: 20 }).map(() => <ProductCompactSkeleton />)}
      </Box>
    )
  }

  const renderSkeleton = (): JSX.Element => {
    return width === Width.compact ? renderCompactSkeleton() : renderWideSkeleton()
  };


  // render

  return (
    isLoading ?
    renderSkeleton()
    : (
      products?.length ?
        (<Box className={styles.wrapper}>
          <Box className={styles.container_wide}>
            {width == Width.wide ?
              (<Box className={styles.container_wide}>
                {products.map((product: Product) => <ProductWide key={product.id} {...product} />)}
              </Box>
            )
              : (
                <Box className={styles.container_compact}>
                  {products.map((product: Product) => <ProductCompact key={product.id} {...product} />)}
                </Box>)}
          </Box>

        </Box>)
        : <></>));
}