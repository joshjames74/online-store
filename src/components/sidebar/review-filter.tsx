import { Box, Text } from "@chakra-ui/react";
import styles from "./review-filter.module.css";
import ReviewStars from "../review/review-stars";
import { useSearchParamsState } from "@/zustand/store";


export default function ReviewFilter(): JSX.Element {

  const minReview = useSearchParamsState((state) => state.params.min_review);
  const updateMinReview = useSearchParamsState((state) => state.updateMinReview);

  const renderReviewStars = () => {
    return [5, 4, 3, 2, 1, 0].map((val: number) => {
      const selected_styles =
        minReview === val ? styles.review_star_selected : "";
      return (
        <Box
          className={styles.review_star_container + " " + selected_styles}
          key={val.toString()}
          onClick={() => updateMinReview(val)}
          cursor="pointer"
        >
          <ReviewStars value={val} fontSize="s" />
          <Text fontSize="md" fontWeight="semibold">
            {val.toString()} stars and up
          </Text>
        </Box>
      );
    });
  };

  return (
    <Box className={styles.container}>
      <Text fontWeight="bold">Review Score</Text>
      <Box className={styles.review_star_wrapper}>{renderReviewStars()}</Box>
    </Box>
  );
}
