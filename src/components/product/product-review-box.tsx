import { Heading, HStack } from "@chakra-ui/react";
import ReviewStars from "../review/review-stars";

export default function ProductReviewBox({
  review_score,
  review_count,
}: {
  review_score: number;
  review_count: number;
}): JSX.Element {
  return (
    <HStack gap="0.5em" alignItems="center">
      <ReviewStars value={review_score} fontSize="1rem"></ReviewStars>
      <Heading as="h6" fontSize="inherit">
        {review_count.toString()} Reviews
      </Heading>
    </HStack>
  );
}
