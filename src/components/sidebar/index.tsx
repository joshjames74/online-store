import { Box, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import styles from "./index.module.css"
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";

export default function Sidebar(): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        console.log("AT component");
        console.log(user);
    }, [user]);

    const clearFilters = useSearchStore((state) => state.clearParams);
    const params = useSearchStore((state) => state.params);

    const router = useRouter();

    const handleDelete = () => {
        clearFilters();
        router.refresh();
    }

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