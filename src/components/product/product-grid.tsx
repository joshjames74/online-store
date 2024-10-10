'use client';
import { getAllProducts } from "@/api/request/productRequest";
import ProductWide from "@/components/product/product-wide";
import { Box } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import { useState, useEffect } from "react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { QueryParams } from "@/redux/reducers/product";


enum Width {
  wide = "WIDE",
  compact = "COMPACT"
}


export default function ProductGrid(): JSX.Element {


  // const dispatch = useDispatch();
  // const products = useSelector(
  //   (state: RootState) => state.productReducer.products
  // );
  // const queryParams = useSelector(
  //   (state: RootState) => state.productReducer.query_params
  // );


  // const fetchProducts = (params: QueryParams): void => {
  //   if (!params) { return }
  // }


  const [products, setProducts] = useState<Product[]>();
  const [width, setWidth] = useState<Width>(Width.wide);

  useEffect(() => {
    getAllProducts().then((res: Product[]) => setProducts(res));
  }, [])

  return ( products?.length ? 
    (<Box className={styles.wrapper}>
      <Box className={styles.container_wide}>
          {width == Width.wide ? 
          ( <Box className={styles.container_wide}>
              {products.map((product: Product) => <ProductWide key={product.id} {...product} />)}
            </Box> ) 
          : ( 
            <Box className={styles.container_compact}>
              {products.map((product: Product) => <ProductCompact key={product.id} {...product} />)}
            </Box> )}
      </Box> 

    </Box>)
    : <></>);
}