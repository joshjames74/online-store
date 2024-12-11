import {
  Box,
  Checkbox,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import styles from "./category-filter.module.css";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSearchParamsState } from "@/zustand/store";
import { getAllCategories } from "@/api/request/categoryRequest";


export default function CategoryFilter(): JSX.Element {

  const updateCategories = useSearchParamsState((state) => state.updateCategories);
  const selectedCategories = useSearchParamsState((state) => state.params.categories);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // load categories to display
  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  // logic to add / remove categories from selected list
  const handleCategoryChange = (id: number): void => {
    if (!selectedCategories) {
      updateCategories([id])
      return;
    }
    if (selectedCategories.includes(id)) {
      updateCategories(
        selectedCategories.filter((categoryId) => categoryId !== id),
      );
      return;
    }
    updateCategories([...selectedCategories, id]);
  };

  const isSelected = (id: number) => selectedCategories ? selectedCategories.includes(id) : false;

  return (
    <Box className={styles.container}>
      <Text fontWeight="bold">Categories</Text>
      {isLoading ? <SkeletonText noOfLines={10} /> : (
        <Box className={styles.checkbox_container}>
          {!categories.length ? <></> : (
            categories.map((category: Category, index: number) => {
              return (
                <Checkbox
                  key={index}
                  isChecked={isSelected(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  fontWeight="semibold"
                >
                  {category.name}
                </Checkbox>
              );
            })
          )}
        </Box>
      )}
    </Box>
  );
}
