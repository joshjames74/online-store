"use client";
import { getProductById } from "@/api/request/productRequest";
import { ProductWithSeller } from "@/api/services/productService";
import ProductPage from "@/components/product/product-page";
import ProductPageSkeleton from "@/components/product/product-page-skeleton";
import ReviewGrid from "@/components/review/review-grid";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const { id } = params;

  const [product, setProduct] = useState<ProductWithSeller>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getProductById(parseInt(id))
      .then((res) => setProduct(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (!id || isNaN(parseInt(id))) {
    //redirect to 404
    return <Box>Page not found</Box>;
  }

  if (isLoading || !product) {
    return <ProductPageSkeleton />;
  }

  return (
    <Box h="5000px">
      <title>{product.title}</title>
      <ProductPage {...product} />
      <section id="reviews">
        <ReviewGrid
          id={parseInt(id)}
          score={product?.review_score ? product?.review_score : 0}
        />
      </section>
    </Box>
  );
}
