import {
  Box,
  Checkbox,
  InputGroup,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import styles from "./category-filter.module.css";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSearchStore } from "@/zustand/store";
import { getAllCategories } from "@/api/request/categoryRequest";
import { useSearchParams } from "next/navigation";
import { parseQueryParams } from "@/api/helpers/utils";

export default function CategoryFilter(): JSX.Element {
  // to do: make categories appear as selected in query params on first load
  const searchParams = useSearchParams();

  const setSearchParams = useSearchStore((state) => state.setParams);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedCategories(parseQueryParams(searchParams).categories);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ categories: selectedCategories });
  }, [selectedCategories]);

  const handleCategoryChange = (id: number): void => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id),
      );
      return;
    }
    setSelectedCategories([...selectedCategories, id]);
  };

  return (
    <Box className={styles.container}>
      <Text fontWeight="bold">Categories</Text>
      {isLoading ? (
        <SkeletonText noOfLines={10} />
      ) : (
        <Box className={styles.checkbox_container}>
          {categories.length ? (
            categories.map((category: Category, index: number) => {
              return (
                <Checkbox
                  key={index}
                  isChecked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  fontWeight="semibold"
                >
                  {category.name}
                </Checkbox>
              );
            })
          ) : (
            <></>
          )}
        </Box>
      )}
    </Box>
  );
}
