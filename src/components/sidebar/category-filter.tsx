import {
  Box,
  Checkbox,
  Heading,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSearchParamsState } from "@/zustand/store";
import { getAllCategories } from "@/api/request/categoryRequest";


export default function CategoryFilter(
  {
    updateCategories,
    selectedCategories
  }:
  {
    updateCategories: (categories: number[]) => void,
    selectedCategories: number[] | undefined
  }
): JSX.Element {



  // const updateCategories = useSearchParamsState(
  //   (state) => state.updateCategories,
  // );
  // const selectedCategories = useSearchParamsState(
  //   (state) => state.params.categories,
  // );

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
      updateCategories([id]);
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

  const isSelected = (id: number) =>
    selectedCategories ? selectedCategories.includes(id) : false;

  return (
    <Stack>
      <Heading as="h3" className="upper">
        Categories
      </Heading>
      {isLoading ? (
        <SkeletonText noOfLines={10} />
      ) : (
        <Stack gap="0.2em">
          {!categories.length ? (
            <></>
          ) : (
            categories.map((category: Category, index: number) => {
              return (
                <Checkbox
                  iconColor="var(--primary-text)"
                  colorScheme="var(--primary-text)"
                  key={index}
                  isChecked={isSelected(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                >
                  <Text as="h5">{category.name}</Text>
                </Checkbox>
              );
            })
          )}
        </Stack>
      )}
    </Stack>
  );
}
