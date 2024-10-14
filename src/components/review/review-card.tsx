import { Box, Text } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import styles from "./review-card.module.css"
import ReviewStars from "./review-stars";

export default function ReviewCard(review: Review): JSX.Element {

    return (

        <Box className={styles.container}>
            <Box className={styles.user_container}>
                <Box className={styles.user_image}></Box>
                <Text>{review.usrId}</Text>
            </Box>
            <Box className={styles.review_container} >
                <ReviewStars value={review.score}/>
                <Text>{review.title}</Text>
            </Box>
            <Text>{review.content}</Text>
        </Box>

    )

}