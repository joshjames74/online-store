import { Box, Text } from "@chakra-ui/react";
import styles from "./product-review-box.module.css";
import ReviewStars from "../review/review-stars";

export default function ProductReviewBox({
  review_score,
  review_count,
}: {
  review_score: number;
  review_count: number;
}): JSX.Element {
  return (
    <Box className={styles.container}>
      <ReviewStars value={review_score}></ReviewStars>
      <Text fontSize="xs" fontWeight="bold">
        {review_score.toPrecision(2).toString()}
      </Text>
      <Text className={styles.review_score} fontSize="xs">
        ({review_count.toString()})
      </Text>
    </Box>
  );
}
