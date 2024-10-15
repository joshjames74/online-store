import { Box, Button, Text } from "@chakra-ui/react";
import styles from "./review-summary.module.css"
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import ReviewStars from "./review-stars";
import { getReviewCountsByProductId } from "@/api/request/reviewRequest";
import ReviewCardSkeleton from "./review-card-skeleton";
import { useReviewSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";

export default function ReviewSummary({ id, score }: { id: number, score: number }): JSX.Element {

    const [counts, setCounts] = useState<number[]>([]);
    const [percentages, setPercentages] = useState<number[]>([]);
    const [total, setTotal] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //
    useEffect(() => {
        setIsLoading(true);
        getReviewCountsByProductId(id).then((res: number[]) => {

            // compute total and percentages
            const total = res.reduce((partialSum, curr) => partialSum + curr, 0)
            const percentages = res.map((count: number) => (total && total > 0) ? count / total : 0)

            // save
            setCounts(res);
            setTotal(total);
            setPercentages(percentages);
            setIsLoading(false);
        });
    }, [])

    const { theme } = useContext(ThemeContext);

    
    const params = useReviewSearchStore((state) => state.params);
    const clearParams = useReviewSearchStore((state) => state.clearParams);
    const setParams = useReviewSearchStore((state) => state.setParams);
    const getAsUrl = useReviewSearchStore((state) => state.getAsUrl);

    const handleClickReviewScore = (score: number) => {
        setParams({ score: score })
    }

    const handleClearFilters = () => {
        clearParams();
    };

    const router = useRouter();

    useEffect(() => {
        router.push(`?${getAsUrl()}`)
    }, [params]);



    return (isLoading ? <ReviewCardSkeleton /> :

        <Box className={styles.container}>

            <Box className={styles.header}>
                <Text className={styles.title} fontSize="2xl">Customer Reviews</Text>
                <Box className={styles.review_stars_container}>
                    <ReviewStars value={score} fontSize="xl" />
                    <Text>{score} out of 5</Text>
                </Box>
                <Text>{total} global reviews</Text>
            </Box>

            <Box className={styles.body}>
                {Array.from({ length: 6 }).reverse().map((_, index) => {
                    index = 5 - index;
                    const isSelected = index === params.score;
                    return (
                        <Box className={styles.star_container + ' ' + (isSelected ? styles.selected : '')}
                            onClick={() => handleClickReviewScore(index)}>
                            <Text className={styles.star_text}>{index} star</Text>
                            <Box
                                style={{ gridTemplateColumns: `${percentages[index]}fr ${1 - percentages[index]}fr` }}
                                className={styles.star_content}
                                bgColor={theme.colors.border.primary}>
                                <Box bgColor={theme.colors.accent.primary}></Box>
                                <Box bgColor={theme.colors.background.secondary}></Box>
                            </Box>
                            <Text>{Math.round(percentages[index] * 100)}%</Text>
                        </Box>)
                })}
            </Box>

            <Text _hover={{ textDecoration: "underline" }} fontSize="sm" onClick={() => handleClearFilters()}>Clear Filters</Text>
        </Box>


    )
}