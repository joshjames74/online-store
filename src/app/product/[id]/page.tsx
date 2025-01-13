"use client";
import { getProductById } from "@/api/request/productRequest";
import { ProductWithSeller } from "@/api/services/productService";
import ProductPage from "@/components/product/product-page";
import ReviewGrid from "@/components/review/review-grid";
import { Spinner, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { id: Readonly<string> };
}): JSX.Element {
  const { id } = params;

  const [product, setProduct] = useState<ProductWithSeller>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getProductById(parseInt(id))
      .then((res) => setProduct(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (!id || isNaN(parseInt(id))) {
    router.push("/404");
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!product) {
    return <></>;
  }

  return (
    <>
      <title>{product.title}</title>
      <Stack margin="1em" w="fit-content" maxW="5xl" gap="2em">
        <ProductPage {...product} />
        <section id="reviews">
          <ReviewGrid id={parseInt(id)} score={product.review_score} />
        </section>
      </Stack>
    </>
  );
}
