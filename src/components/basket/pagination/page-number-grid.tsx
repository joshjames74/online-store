import { ThemeContext } from "@/contexts/theme-context";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useContext } from "react";

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
  const { theme } = useContext(ThemeContext);

  const PageBox = (value: number, isSelected: boolean, key: number) => {
    return (
      <Button
        key={key}
        bgColor={
          isSelected
            ? theme.colors.accent.primary
            : theme.colors.background.secondary
        }
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
