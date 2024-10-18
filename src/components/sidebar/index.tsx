import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import styles from "./index.module.css"
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";

export default function Sidebar(): JSX.Element {

    const { theme } = useContext(ThemeContext);

    const clearFilters = useSearchStore((state) => state.clearParams);
    const params = useSearchStore((state) => state.searchParams);

    const router = useRouter();

    const handleDelete = () => {
        clearFilters();
        router.refresh();
    }

    // return (
    //     <Box className={styles.container}>
    //         <PriceFilter />
    //         <ReviewFilter />
    //         <CategoryFilter />
    //         <Text className={styles.delete_text} onClick={handleDelete}>Clear Filters</Text>
    //     </Box>
    // )
    return (
        <Card className={styles.container} h="fit-content" minW="2xs">
            <CardHeader paddingBottom={2}>
                <Heading fontSize="lg" fontWeight="semibold">Filters</Heading>
            </CardHeader>
            <Divider />
            <CardBody paddingTop={2} paddingBottom={0}>
                <Stack gap={2}>
                    <PriceFilter />
                    <ReviewFilter />
                    <CategoryFilter />
                </Stack>
            </CardBody>
            <CardFooter paddingTop={1}>
                <Text textDecoration="underline" _hover={{color: theme.colors.accent.secondary}} onClick={handleDelete}>Clear Filters</Text>
            </CardFooter>
        </Card>
    )

}