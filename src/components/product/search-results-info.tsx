import { Heading, HStack } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { Width } from "@/redux/reducers/product";
import { useSearchParamsState, useSearchResultsState } from "@/zustand/store";
import { useRouter } from "next/navigation";


export default function SearchResultsInfo(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const updatePerPage = useSearchParamsState((state) => state.updatePerPage);
  const updatePageNumber = useSearchParamsState((state) => state.updatePageNumber);

  const perPage = useSearchParamsState((state) => state.params.perPage);
  const pageNumber = useSearchParamsState((state) => state.params.pageNumber);
  const executeSearch = useSearchParamsState((state) => state.executeSearch);
  const resultsCount = useSearchResultsState((state) => state.resultsCount)

  const handleChangeWidth = (width: Width) => {
    updatePerPage(width);
    updatePageNumber(1);
    executeSearch();
    router.push("/");
  };

  const lowerBound: number =
    perPage && pageNumber
      ? (pageNumber - 1) * perPage + 1
      : 1;
  const upperBound: number =
    perPage && pageNumber
      ? Math.min(lowerBound + perPage - 1, resultsCount)
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
