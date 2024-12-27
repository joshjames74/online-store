"use client";
import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParamsState, useSearchResultsState } from "@/zustand/store";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/api/request/categoryRequest";
import { useRouter } from "next/navigation";

export default function SearchBar(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [isLessThan1100px] = useMediaQuery("(max-width: 1100px)");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const updateQuery = useSearchParamsState((state) => state.updateQuery);
  const updateCategories = useSearchParamsState(
    (state) => state.updateCategories,
  );
  const updatePageNumber = useSearchParamsState(
    (state) => state.updatePageNumber,
  );

  const query = useSearchParamsState((state) => state.params.query);
  const params = useSearchParamsState((state) => state.params);
  const executeSearch = useSearchParamsState((state) => state.executeSearch);

  // fetch categories
  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleClick = () => {
    updatePageNumber(1);
    executeSearch();
    router.push("/");
  };

  return (
    <Box flexGrow="1" padding="0" w="full">
      <HStack
        overflow="hidden"
        bgColor={theme.colors.background.primary}
        color={theme.colors.text.primary}
        alignItems="stretch"
        gap={0}
      >
      
          <Select
            onChange={(e) => updateCategories([parseInt(e.target.value || "")])}
            className="secondary-button"
            borderRight="none !important"
            display={isLessThan1100px ? "none" : "block"}
            maxW="200px"
            textOverflow="ellipsis"
            placeholder="All"
            value={params.categories?.length === 1 ? params.categories[0] : "All"}
            color="white"
          >
            {isLoading || !categories.length 
            ? <></>
            :
              categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              )
            )}
          </Select>
        <Input
          borderRightWidth="0 !important"
          placeholder="Search"
          value={query}
          className="secondary-button"
          onChange={(e) => updateQuery(e.target.value)}
        />
        <Button onClick={() => handleClick()} className="secondary-button" bgColor={`${theme.colors.accent.primary} !important`} color="var(--primary-text) !important">
          <SearchOutlined  />
        </Button>
      </HStack>
    </Box>
  );
}
