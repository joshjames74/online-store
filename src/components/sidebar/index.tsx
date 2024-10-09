import { Box } from "@chakra-ui/react";
import styles from "./index.module.css"
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";

export default function Sidebar(): JSX.Element {

    return (
        <Box className={styles.container}>
            <PriceFilter />
            <ReviewFilter />
            <CategoryFilter />
        </Box>
    )

}