import { Box, Button, HStack } from "@chakra-ui/react";
import "./../../../app/globals.css";


const getPaginationOffset = (pageNumber: number, pagesVisible: number, maxPages: number): number => {
  if (maxPages <= pagesVisible) {
    // All pages fit within the visible range
    return 1;
  }

  const halfVisible = Math.floor(pagesVisible / 2);

  if (pageNumber <= halfVisible + 1) {
    // At the start: show pages 1 to pagesVisible
    return 1;
  } else if (pageNumber >= maxPages - halfVisible) {
    // At the end: show last pagesVisible pages
    return maxPages - pagesVisible + 1;
  } else {
    // Center the current page
    return pageNumber - halfVisible;
  }
};


export type PageNumberParams = {
  pageNumber: number;
  onClickPageNumber: (pageNumber: number) => void;
  maxPages: number;
};

export default function PageNumberGrid({
  params,
}: {
  params: PageNumberParams;
}): JSX.Element {

  const { pageNumber, onClickPageNumber, maxPages } = params;

  const pagesVisible = Math.min(5, maxPages);
  const offset = getPaginationOffset(pageNumber, pagesVisible, maxPages);
  

  const PageBox = (value: number, isSelected: boolean, key: number) => {
    return (
      <Button
        key={key}
        className={isSelected ? "secondary-button" : "primary-button"}
        onClick={() => onClickPageNumber(value)}
      >
        {value}
      </Button>
    );
  };


  return (
    <Box w="full" padding="1em">
      <HStack justifyContent="center">
        {Array.from({ length: pagesVisible }).map((_, index) =>
          PageBox(index + offset, pageNumber === index + offset, index),
        )}
      </HStack>
    </Box>
  );
}
