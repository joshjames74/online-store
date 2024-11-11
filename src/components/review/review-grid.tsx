import { getReviewById, getReviewsByProductId } from "@/api/request/reviewRequest";
import { Box, Button, Card, CardHeader, Heading, HStack, Select, Skeleton, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import ReviewCard from "./review-card";
import styles from "./review-grid.module.css"
import ReviewSummary from "./review-summary";
import ReviewForm from "./review-form";
import ReviewCardSkeleton from "./review-card-skeleton";
import ReviewSummarySkeleton from "./review-summary-skeleton";
import { useSearchParams } from "next/navigation";
import { useReviewSearchStore } from "@/zustand/store";
import { ReviewFilter, ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { getReviewsBySearch } from "@/api/request/reviewRequest";
import { useRouter } from "next/navigation";
import { CaretDownOutlined, CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { ResultType } from "@/api/helpers/types";
import { ThemeContext } from "@/contexts/theme-context";

export default function ReviewGrid({ id, score }: { id: number, score: number } ): JSX.Element {

    const { theme } = useContext(ThemeContext);

    const [reviews, setReviews] = useState<ResultType<'review', { usr: true}>[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false);

    const setParams = useReviewSearchStore((state) => state.setParams);
    const params = useReviewSearchStore((state) => state.params);
    const getAsUrl = useReviewSearchStore((state) => state.getAsUrl);

    const searchParams = useSearchParams();

    const router = useRouter();

    const handleChangeFilter = (filter: number) => {
        setParams({ review_filter: filter });
        router.push(`?${getAsUrl()}`)
    };

    const handleClickButton = () => {
        setShowForm(!showForm);
    }


    const fetchData = () => {
        const reviewParams: Partial<ReviewParams> = {}
        reviewParams.productId = id;

        const score = searchParams.get('score');
        if (score && !isNaN(parseInt(score))) {
            reviewParams.score = parseInt(score);
        };

        const filter = parseInt(searchParams.get('review_filter') || '');
        if (filter && Object.values(ReviewFilter).includes(filter as ReviewFilter)) {
            reviewParams.review_filter = filter;
        };

        setIsLoading(true);
        getReviewsBySearch(reviewParams).then(res => {
            setReviews(res);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
        delete reviewParams.productId;
        setParams(reviewParams);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    return (
        <>
            <Box className={styles.container}>
                <ReviewSummary id={id} score={score} />
                <Box className={styles.review_container} minW="fit-content" w="max-content" maxW="100%">
                    <HStack justifyContent="space-between" w="full">
                        <HStack>
                            <Heading fontWeight="semibold" fontSize="xl" whiteSpace="nowrap">Top Reviews</Heading>
                            <Select 
                            placeholder="Filter By"
                            value={params.review_filter}
                            onChange={(e) => handleChangeFilter(parseInt(e.target.value || ''))}
                            fontSize="sm">
                                <option value={ReviewFilter.SCORE_LOW_TO_HIGH}>Score: Low - High</option>
                                <option value={ReviewFilter.SCORE_HIGH_TO_LOW}>Score: High - Low</option>
                                <option value={ReviewFilter.DATE_NEW_TO_OLD}>Recent</option>
                                <option value={ReviewFilter.DATE_OLD_TO_NEW}>Oldest</option>
                            </Select>
                        </HStack>
                        <Button onClick={handleClickButton} minW="fit-content" gap={2} bgColor={theme.colors.accent.primary}>
                            <PlusOutlined /> Add Review
                        </Button>
                    </HStack>
                    <Box className={styles.grid_container}>
                        { isLoading 
                        ? Array.from({length: 3}).map((_, index: number) => <ReviewCardSkeleton key={index} />)
                        : reviews?.length ? reviews.map((review: Review, index: number) => <ReviewCard {...review} key={index} />) : (
                            <Card>
                                <CardHeader gap="1em" display="flex" flexDirection="column">
                                    <Heading fontWeight="semibold" fontSize="md">No reviews found</Heading>
                                </CardHeader>
                            </Card>
                        ) }
                    </Box>  
                </Box>
            </Box>
            <ReviewForm id={id} isVisible={showForm} onClose={() => setShowForm(false)}/>
        </>
        )
}