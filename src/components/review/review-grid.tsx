import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  HStack,
  Select,
  Spinner,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import ReviewCard from "./review-card";
import styles from "./review-grid.module.css";
import ReviewSummary from "./review-summary";
import ReviewForm from "./review-form";
import { useReviewSearchStore } from "@/zustand/store";
import { ReviewFilter } from "@/api/transformers/reviewSearchTransformer";
import { PlusOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/contexts/theme-context";
import { ReviewWithUser } from "@/api/services/reviewService";
import { RenderComponentIfLoggedIn } from "../auth/render-conditionally";
import PageNumberGrid from "../basket/pagination/page-number-grid";
import { useDispatch, useSelector } from "react-redux";
import { selectMainReviewFilters, selectMainReviews } from "@/redux/selectors";
import { AppDispatch, setMainReviewFilter, setMainReviewPageNumber, setMainReviewProductId } from "@/redux/store";
import { fetchMainReview } from "@/redux/actions/reviews";

export default function ReviewGrid({
  id,
  score,
}: {
  id: number;
  score: number;
}): JSX.Element {

  const { theme } = useContext(ThemeContext);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLessThan600px] = useMediaQuery("(max-width: 600px)");


  const clearParams = useReviewSearchStore((state) => state.clearParams);


  // redux

  const dispatch = useDispatch<AppDispatch>();
  const maxPages = 5;

  const results = useSelector(selectMainReviews);
  const filters = useSelector(selectMainReviewFilters);

  const fetchReviews = () => dispatch(fetchMainReview());

  const updateReviewFilter = (filter: ReviewFilter) => dispatch(setMainReviewFilter(filter));
  const updateProductId = (id: number) => dispatch(setMainReviewProductId(id));
  const updatePageNumber = (pageNumber: number) => dispatch(setMainReviewPageNumber(pageNumber));


  //

  const handleChangeFilter = (filter: number) => {
    updateReviewFilter(filter);
  };

  const handleClickButton = () => {
    setShowForm(!showForm);
  };

  const pageNumber = filters.pageNumber || 0;

  useEffect(() => {
    updateProductId(id);
    fetchReviews();
  }, []);

  return (
    <>
      <Box className={styles.container} gap="1em" w="full">
        <ReviewSummary id={id} score={score} />

        <Stack className={styles.review_container}>
          <HStack className={styles.review_meta_container} alignItems="left">
            <Heading as="h2" className="noOfLines-1">
              Top Reviews
            </Heading>
            <HStack justifyContent="left">
              <Select
                className="select"
                placeholder="Filter By"
                value={filters.review_filter}
                onChange={(e) =>
                  handleChangeFilter(parseInt(e.target.value || ""))
                }
                w="200px"
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
              <RenderComponentIfLoggedIn>
                <Button
                  className="primary-button"
                  onClick={handleClickButton}
                  minW="fit-content"
                  gap={2}
                >
                  <PlusOutlined /> Add Review
                </Button>
              </RenderComponentIfLoggedIn>
            </HStack>
          </HStack>

          <Stack gap="1em" w="full">
            {results.isLoading ? (
              <Spinner />
            ) : results?.reviews?.length ? (
              results?.reviews.map((review: ReviewWithUser, index: number) => (
                <ReviewCard {...review} key={index} />
              ))
            ) : (
              <Card shadow="none" padding="0" margin="0">
                <CardHeader gap="1em" maxW="2xl">
                  <Heading as="h4">No reviews found</Heading>
                </CardHeader>
              </Card>
            )}
            {results.isLoading ? (
              <></>
            ) : (
              PageNumberGrid({
                params: {
                  pageNumber: pageNumber,
                  onClickPageNumber: updatePageNumber,
                  maxPages: maxPages,
                },
              })
            )}
          </Stack>
        </Stack>
      </Box>
      <ReviewForm
        id={id}
        isVisible={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
