import { getReviewById, getReviewsByProductId } from "@/api/request/reviewRequest";
import { Box } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import { useEffect, useState } from "react";
import ReviewCard from "./review-card";
import styles from "./review-grid.module.css"
import ReviewSummary from "./review-summary";

export default function ReviewGrid({ params }: { params: { id: number } } ): JSX.Element {


    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        getReviewsByProductId(params.id).then(res => {
            setReviews(res)
            setIsLoading(false);
        });
    }, [])

    return (

        (isLoading || !reviews.length) ? <Box>Loading</Box> :
            <Box className={styles.container}>
                <ReviewSummary />
                <Box className={styles.grid_container}>
                    {reviews.map((review: Review) => <ReviewCard {...review} />)}
                </Box>
            </Box>

    )

}