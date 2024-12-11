"use client";
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import styles from "./search-bar.module.css";
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const updateQuery = useSearchParamsState((state) => state.updateQuery);
  const updateCategories = useSearchParamsState((state) => state.updateCategories);
  const updatePageNumber = useSearchParamsState((state) => state.updatePageNumber);

  const query = useSearchParamsState((state) => state.params.query);
  const params = useSearchParamsState((state) => state.params);
  const executeSearch = useSearchParamsState((state) => state.executeSearch);

  // fetch categories
  useEffect(() => {
    setIsLoading(true);
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
    <Box className={styles.container}>
      <InputGroup
        className={styles.input_container}
        bgColor={theme.colors.background.primary}
        color={theme.colors.text.primary}
      >
        <InputLeftAddon
          className={styles.input_left_addon}
          maxW="200px"
          textOverflow="ellipsis"
        >
          <Select
            onChange={(e) => updateCategories([parseInt(e.target.value || "")])}
            placeholder="All"
            className={styles.select_container}
            variant="unstyled"
            value={params.categories?.length === 1 ? params.categories[0] : "All"}
            textOverflow="ellipsis"
          >
            {isLoading || !categories.length ? <></> : (
              categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </Select>
        </InputLeftAddon>
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
        />
        <InputRightElement
          onClick={() => handleClick()}
          bgColor={theme.colors.accent.primary}
          color={theme.colors.text.secondary}
          maxW="fit-content"
          paddingX="1em"
        >
          <SearchOutlined />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
