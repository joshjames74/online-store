import { Box, Button, HStack } from "@chakra-ui/react";
import "./../../../app/globals.css";

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
        {Array.from({ length: maxPages }).map((_, index) =>
          PageBox(index + 1, pageNumber === index + 1, index),
        )}
      </HStack>
    </Box>
  );
}
