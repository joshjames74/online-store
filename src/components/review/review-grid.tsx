import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import ReviewCard from "./review-card";
import styles from "./review-grid.module.css";
import ReviewSummary from "./review-summary";
import ReviewForm from "./review-form";
import { useReviewSearchStore } from "@/zustand/store";
import {
  ReviewFilter,
} from "@/api/transformers/reviewSearchTransformer";
import { useRouter } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/contexts/theme-context";
import { ReviewWithUser } from "@/api/services/reviewService";
import { RenderComponentIfLoggedIn } from "../auth/render-conditionally";
import PageNumberGrid from "../basket/pagination/page-number-grid";

export default function ReviewGrid({
  id,
  score,
}: {
  id: number;
  score: number;
}): JSX.Element {

  const { theme } = useContext(ThemeContext);

  const [showForm, setShowForm] = useState<boolean>(false);

  const maxPages = useReviewSearchStore((state) => state.maxPages);
  const params = useReviewSearchStore((state) => state.params);
  const clearParams = useReviewSearchStore((state) => state.clearParams);
  const updateReviewFilter = useReviewSearchStore((state) => state.updateReviewFilter);
  const updateProductId = useReviewSearchStore((state) => state.updateProductId);
  const updatePageNumber = useReviewSearchStore((state) => state.updatePageNumber);
  const getAsUrl = useReviewSearchStore((state) => state.getAsUrl);
  const reviews = useReviewSearchStore((state) => state.reviews);

  const router = useRouter();

  const handleChangeFilter = (filter: number) => {
    updateReviewFilter(filter);
    router.push(getAsUrl());
  };

  const handleClickButton = () => {
    setShowForm(!showForm);
  };

  const loadProductId = useMemo(() => {
    clearParams();
    updateProductId(id);
  }, [id])

  const pageNumber = params.pageNumber || 0;

  return (
    <>
      <Box className={styles.container}>
        <ReviewSummary id={id} score={score} />
        <Box
          className={styles.review_container}
          minW="fit-content"
          w="max-content"
          maxW="100%"
        >
          <HStack justifyContent="space-between" w="full">
            <HStack>
              <Heading fontWeight="semibold" fontSize="xl" whiteSpace="nowrap">
                Top Reviews
              </Heading>
              <Select
                placeholder="Filter By"
                value={params.review_filter}
                onChange={(e) =>
                  handleChangeFilter(parseInt(e.target.value || ""))
                }
                fontSize="sm"
              >
                <option value={ReviewFilter.SCORE_LOW_TO_HIGH}>
                  Score: Low - High
                </option>
                <option value={ReviewFilter.SCORE_HIGH_TO_LOW}>
                  Score: High - Low
                </option>
                <option value={ReviewFilter.DATE_NEW_TO_OLD}>Recent</option>
                <option value={ReviewFilter.DATE_OLD_TO_NEW}>Oldest</option>
              </Select>
            </HStack>
            <RenderComponentIfLoggedIn>
              <Button
                onClick={handleClickButton}
                minW="fit-content"
                gap={2}
                bgColor={theme.colors.accent.primary}
              >
                <PlusOutlined /> <p className={styles.review_text}>Add Review</p>
              </Button>
            </RenderComponentIfLoggedIn>
          </HStack>
          <Box className={styles.grid_container}>
            {reviews?.length ? (
              reviews.map((review: ReviewWithUser, index: number) => (
                <ReviewCard {...review} key={index} />
              ))
            ) : (
              <Card>
                <CardHeader gap="1em" display="flex" flexDirection="column">
                  <Heading fontWeight="semibold" fontSize="md">
                    No reviews found
                  </Heading>
                </CardHeader>
              </Card>
            )}
          {PageNumberGrid({ params: { 
      pageNumber: pageNumber, 
      onClickPageNumber: updatePageNumber, 
      maxPages: maxPages }})}
          </Box>
        </Box>
      </Box>
      <ReviewForm
        id={id}
        isVisible={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
