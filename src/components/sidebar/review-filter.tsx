import { Box, Text } from "@chakra-ui/react";
import styles from "./review-filter.module.css"
import { useState } from "react";
import ReviewStars from "../review/review-stars";


export default function ReviewFilter(): JSX.Element {

    const renderReviewStars = () => {
        return [5, 4, 3, 2, 1, 0].map((val: Number) => {
            return (
            <Box className={styles.review_star_container} key={val.toString()}>
                <ReviewStars value={val} fontSize="s"/> 
                <Text fontSize="md">{val.toString()} stars and up</Text>
            </Box>
            )
        })
    }

    return (
        <Box className={styles.container}>
            <Text fontWeight="bold">Review Score</Text>
            <Box className={styles.review_star_wrapper}>{renderReviewStars()}</Box>
        </Box>
    )

}