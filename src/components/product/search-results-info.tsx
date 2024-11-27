import { Box, Heading, HStack, Select, Text } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { Width } from "@/redux/reducers/product";
import { useSearchStore } from "@/zustand/store";

export default function SearchResultsInfo(): JSX.Element {
  const { theme } = useContext(ThemeContext);

  const setSearchParams = useSearchStore((state) => state.setParams);
  const params = useSearchStore((state) => state.params);
  const resultsCount = useSearchStore((state) => state.resultsCount);

  const perPage = useSearchStore((state) => state.params.perPage);

  const handleChangeWidth = (width: Width) => {
    setSearchParams({ perPage: width, pageNumber: 1 });
  };

  const lowerBound: number =
    params.perPage && params.pageNumber
      ? (params.pageNumber - 1) * params.perPage + 1
      : 1;
  const upperBound: number =
    params.perPage && params.pageNumber
      ? Math.min(lowerBound + params.perPage - 1, resultsCount)
      : 1;

  return (
    <HStack
      bgColor={theme.colors.accent.tertiary}
      justify="space-between"
      padding="1em"
    >
      <Heading className={styles.heading}>
        {resultsCount > 0
          ? `Showing ${lowerBound} - ${upperBound} of ${resultsCount} results`
          : `No results found`}
      </Heading>
      <HStack gap={2}>
        <HStack fontSize="lg">
          <Heading className={styles.heading}>Results per page</Heading>
          <Heading
            className={styles.heading}
            onClick={() => handleChangeWidth(Width.WIDE)}
            textDecoration={perPage === Width.WIDE ? "underline" : ""}
          >
            {Width.WIDE}
          </Heading>
          <Heading
            className={styles.heading}
            onClick={() => handleChangeWidth(Width.COMPACT)}
            textDecoration={perPage === Width.COMPACT ? "underline" : ""}
          >
            {Width.COMPACT}
          </Heading>
        </HStack>
      </HStack>
    </HStack>
  );
}
