import { Box, Text } from "@chakra-ui/react";
import styles from "./index.module.css"
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar(): JSX.Element {

    const clearFilters = useSearchStore((state) => state.clearParams);
    const params = useSearchStore((state) => state.searchParams);

    const router = useRouter();

    const handleDelete = () => {
        clearFilters();
        router.refresh();
    }

    useEffect(() => {
        console.log(params);
    }, [params]);



    return (
        <Box className={styles.container}>
            <PriceFilter />
            <ReviewFilter />
            <CategoryFilter />
            <Text className={styles.delete_text} onClick={handleDelete}>Clear Filters</Text>
        </Box>
    )

}