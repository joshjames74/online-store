import { Box, Text } from "@chakra-ui/react";
import styles from "./review-summary.module.css"
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import ReviewStars from "./review-stars";

export default function ReviewSummary(): JSX.Element {

    const percentage = 0.66;
    const { theme } = useContext(ThemeContext)

    return (

        <Box className={styles.container}>
            <Box className={styles.summary_container}>
                <Text className={styles.title} fontSize="2xl">Customer Reviews</Text>
                <Box className={styles.review_stars_container}>
                    <ReviewStars value={4.5} fontSize="xl"/>
                    <Text>4.5 out of 5</Text>
                </Box>
                <Text>1,000 global reviews</Text>
            </Box>
            <Box className={styles.stars_container}>
                {Array.from({ length: 6}).map((_, index) => (
                    <Box className={styles.star_container}>
                        <Text>{index} star</Text>
                        <Box 
                            style={{gridTemplateColumns: `${percentage}fr ${1-percentage}fr`}} 
                            className={styles.star}
                            bgColor={theme.colors.border.primary}>
                            <Box bgColor={theme.colors.accent.primary}></Box>
                            <Box bgColor={theme.colors.background.secondary}></Box>
                        </Box>
                        <Text>66%</Text>
                    </Box>
                ))}
            </Box>
        </Box>


    )
}