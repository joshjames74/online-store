"use client";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import ProductWide from "@/components/product/product-wide";
import { Box, Card, CardBody, Heading, useMediaQuery } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ProductCompact from "./product-compact";
import styles from "./product-grid.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { parseQueryParams } from "@/api/helpers/utils";
import ProductWideSkeleton from "./product-wide-skeleton";
import ProductCompactSkeleton from "./product-compact-skeleton";
import { ManyWithMetadata, ResultType } from "@/api/helpers/types";
import { Width } from "@/redux/reducers/product";
import { useSearchStore } from "@/zustand/store";
import PageNumberGrid from "../basket/pagination/page-number-grid";

export default function ProductGrid(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] =
    useState<ResultType<"product", { seller: true }>[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isLessThan450px] = useMediaQuery("(max-width: 450px)");

  const width = useSearchStore((state) => state.params.width);
  const setParams = useSearchStore((state) => state.setParams);
  const getURLSearchParams = useSearchStore(
    (state) => state.getURLSearchParams,
  );
  const getMaxPages = useSearchStore((state) => state.getMaxPages);

  const perPage = useSearchStore((state) => state.params.perPage);

  // when click page number
  const handleClickPageNumber = (pageNumber: number) => {
    setParams({ pageNumber: pageNumber });
    router.replace(`/?${getURLSearchParams()}`);
  };

  const loadData = () => {
    setIsLoading(true);
    getProductsBySearchParams(parseQueryParams(searchParams))
      .then((res: ManyWithMetadata<"product", { seller: true }>) => {
        setProducts(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // skeleton

  const renderWideSkeleton = () => {
    return (
      <Box className={styles.container_wide}>
        {Array.from({ length: 20 }).map((_, index: number) => (
          <ProductWideSkeleton key={index} />
        ))}
      </Box>
    );
  };

  const renderCompactSkeleton = () => {
    return (
      <Box className={styles.container_compact}>
        {Array.from({ length: 20 }).map((_, index: number) => (
          <ProductCompactSkeleton key={index} />
        ))}
      </Box>
    );
  };

  const renderSkeleton = (): JSX.Element => {
    return width === Width.COMPACT
      ? renderCompactSkeleton()
      : renderWideSkeleton();
  };

  // to do: clean up conditionas

  return isLoading ? (
    renderSkeleton()
  ) : products?.length ? (
    <Box className={styles.wrapper}>
      {perPage && perPage === Width.WIDE && !isLessThan450px ? (
        <Box className={styles.container_wide}>
          {products.map((product: ResultType<"product", { seller: true }>) => (
            <ProductWide key={product.id} {...product} />
          ))}
        </Box>
      ) : (
        <Box className={styles.container_compact}>
          {products.map((product: ResultType<"product", {}>) => (
            <ProductCompact key={product.id} {...product} />
          ))}
        </Box>
      )}
      <PageNumberGrid
        params={{
          pageNumber: parseQueryParams(searchParams).pageNumber || 0,
          onClickPageNumber: handleClickPageNumber,
          maxPages: getMaxPages(),
        }}
      />
    </Box>
  ) : (
    <Card className={styles.wrapper} h="fit-content">
      <CardBody>
        <Heading fontSize="md">No products found</Heading>
      </CardBody>
    </Card>
  );
}
