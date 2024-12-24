import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import styles from "./review-summary.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import ReviewStars from "./review-stars";
import { getReviewCountsByProductId } from "@/api/request/reviewRequest";
import { useReviewSearchStore } from "@/zustand/store";
import { formatReviewScore } from "@/api/helpers/utils";

export default function ReviewSummary({
  id,
  score,
}: {
  id: number;
  score: number;
}): JSX.Element {
  const [percentages, setPercentages] = useState<number[]>([]);
  const [total, setTotal] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    await getReviewCountsByProductId(id)
      .then((res: number[]) => {
        // compute total and percentages
        const total = res.reduce((partialSum, curr) => partialSum + curr, 0);
        const percentages = res.map((count: number) =>
          total && total > 0 ? count / total : 0,
        );
        setTotal(total);
        setPercentages(percentages);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const { theme } = useContext(ThemeContext);

  const params = useReviewSearchStore((state) => state.params);
  const updateScore = useReviewSearchStore((state) => state.updateScore);
  const clearParams = useReviewSearchStore((state) => state.clearParams);

  useEffect(() => {
    loadData();
  }, []);

  const handleClickReviewScore = (score: number) => {
    updateScore(score);
  };

  const handleClearFilters = () => {
    clearParams();
  };

  return (
    <Card h="fit-content" minW="xs" maxW="2xl" shadow="0" padding="0">
      <CardHeader padding="0">
        <Stack gap={1}>
          <Heading fontSize="2xl">Customer Reviews</Heading>
          {isLoading ? (
            <SkeletonText noOfLines={1} />
          ) : (
            <>
              <HStack>
                <ReviewStars value={score} fontSize="xl" />
                <Heading fontSize="md" fontWeight="semibold">
                  {formatReviewScore(score)} out of 5
                </Heading>
              </HStack>
              <Heading fontSize="md" fontWeight="semibold">
                {total} global reviews
              </Heading>
            </>
          )}
        </Stack>
      </CardHeader>

      <CardBody className={styles.body} paddingBottom={0} paddingTop="0.4em" paddingX="0">
        {isLoading ? (
          <SkeletonText noOfLines={5} />
        ) : (
          Array.from({ length: 6 })
            .reverse()
            .map((_, index: number) => {
              index = 5 - index;
              const isSelected = index === params.score;
              return (
                <Box
                  className={
                    styles.star_container +
                    " " +
                    (isSelected ? styles.selected : "")
                  }
                  key={index}
                  onClick={() => handleClickReviewScore(index)}
                >
                  <Text
                    className={styles.star_text}
                    color={theme.colors.accent.tertiary}
                  >
                    {index} star
                  </Text>
                  <Box
                    style={{
                      gridTemplateColumns: `${percentages[index]}fr ${1 - percentages[index]}fr`,
                    }}
                    className={styles.star_content}
                    bgColor={theme.colors.border.primary}
                  >
                    <Box bgColor={theme.colors.accent.primary}></Box>
                    <Box bgColor={theme.colors.background.primary}></Box>
                  </Box>
                  <Text color={theme.colors.accent.tertiary}>
                    {Math.round(percentages[index] * 100)}%
                  </Text>
                </Box>
              );
            })
        )}
      </CardBody>

      <CardFooter paddingTop="0.4em" paddingX="0">
        <Text
          _hover={{ textDecoration: "underline" }}
          fontSize="sm"
          onClick={() => handleClearFilters()}
        >
          Clear Filters
        </Text>
      </CardFooter>
    </Card>
  );
}
