import { Box, Text } from "@chakra-ui/react";
import styles from "./review-filter.module.css";
import { useEffect, useState } from "react";
import ReviewStars from "../review/review-stars";
import { useSearchStore } from "@/zustand/store";

export default function ReviewFilter(): JSX.Element {
  const [selected, setSelected] = useState<number>(0);
  const setSearchParams = useSearchStore((state) => state.setParams);

  useEffect(() => {
    setSearchParams({ min_review: selected });
  }, [selected]);

  const renderReviewStars = () => {
    return [5, 4, 3, 2, 1, 0].map((val: number) => {
      const selected_styles =
        selected === val ? styles.review_star_selected : "";
      return (
        <Box
          className={styles.review_star_container + " " + selected_styles}
          key={val.toString()}
          onClick={() => setSelected(val)}
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
