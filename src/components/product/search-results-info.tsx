import { Heading, HStack } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { useSearchParamsState, useSearchResultsState } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { Width } from "@/api/transformers/productSearchTransformer";

export default function SearchResultsInfo(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const updatePerPage = useSearchParamsState((state) => state.updatePerPage);
  const updatePageNumber = useSearchParamsState(
    (state) => state.updatePageNumber,
  );

  const perPage = useSearchParamsState((state) => state.params.perPage);
  const pageNumber = useSearchParamsState((state) => state.params.pageNumber);
  const executeSearch = useSearchParamsState((state) => state.executeSearch);
  const resultsCount = useSearchResultsState((state) => state.resultsCount);

  const handleChangeWidth = (width: Width) => {
    updatePerPage(width);
    updatePageNumber(1);
    executeSearch();
    router.push("/");
  };

  const lowerBound: number =
    perPage && pageNumber ? (pageNumber - 1) * perPage + 1 : 1;
  const upperBound: number =
    perPage && pageNumber
      ? Math.min(lowerBound + perPage - 1, resultsCount)
      : 1;

  return (
    <HStack bgColor="var(--muted-text)" justify="space-between" padding="1em">
      <Heading as="h5">
        {resultsCount > 0
          ? `Showing ${lowerBound} - ${upperBound} of ${resultsCount} results`
          : `No results found`}
      </Heading>
      <HStack gap={2}>
        <HStack>
          <Heading as="h5">Results per page</Heading>
          <Heading
            as="h5"
            onClick={() => handleChangeWidth(Width.WIDE)}
            textDecoration={perPage === Width.WIDE ? "underline" : ""}
            className="underline_hover"
          >
            {Width.WIDE}
          </Heading>
          <Heading
            as="h5"
            onClick={() => handleChangeWidth(Width.COMPACT)}
            textDecoration={perPage === Width.COMPACT ? "underline" : ""}
            className="underline_hover"
          >
            {Width.COMPACT}
          </Heading>
        </HStack>
      </HStack>
    </HStack>
  );
}
