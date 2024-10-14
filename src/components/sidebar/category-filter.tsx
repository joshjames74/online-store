import { Box, Checkbox, InputGroup, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import styles from "./category-filter.module.css"
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSearchStore } from "@/zustand/store";
import { getAllCategories } from "@/api/request/categoryRequest";


export default function CategoryFilter(): JSX.Element {

    // to do: make categories appear as selected in query params on first load

    const setSearchParams = useSearchStore((state) => state.setSearchParams);
    
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);



    useEffect(() => {
        getAllCategories().then(res => {
            setCategories(res)
            setIsLoading(false);
        });
    }, []);


    useEffect(() => {
        setSearchParams({ categories: selectedCategories })
    }, [selectedCategories]);


    const handleCategoryChange = (id: number): void => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
            return
        }
        setSelectedCategories([...selectedCategories, id]);
    }

    return (
        <Box className={styles.container}>
            <Text fontWeight="bold">Categories</Text>
            {isLoading ? <SkeletonText noOfLines={10} />:
                <Box className={styles.checkbox_container}>
                    {categories.map((category: Category) => {
                        return (
                            <Checkbox
                                key={category.id}
                                isChecked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}>
                                {category.name}
                            </Checkbox>)
                    })}
                </Box>}
        </Box>
    )

}