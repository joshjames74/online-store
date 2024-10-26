import { getReviewById, getReviewsByProductId } from "@/api/request/reviewRequest";
import { Box, Button, Heading, HStack, Select, Skeleton, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { Review } from "@prisma/client";
import { useEffect, useState } from "react";
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

export default function ReviewGrid({ id, score }: { id: number, score: number } ): JSX.Element {

    const [reviews, setReviews] = useState<Review[]>([]);
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
            setReviews(res)
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


    const renderSkeleton = () => {
        return (
            <Box className={styles.container}>
                <ReviewSummarySkeleton />
                <Box className={styles.review_container}>
                    <Box className={styles.grid_container}>
                        {Array.from({length: 10}).map((_, index: number) => <ReviewCardSkeleton key={index} />)}
                    </Box>
                </Box>
            </Box>
        )
    }

    return (

        isLoading ? renderSkeleton() : (
            <Box className={styles.container}>
                <ReviewSummary id={id} score={score} />
                <Box className={styles.review_container}>
                    <HStack className={styles.review_header}>
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
                    <Box className={styles.grid_container}>
                        {reviews?.length ? reviews.map((review: Review, index: number) => <ReviewCard {...review} key={index} />) : <Box>No reviews</Box>}
                    </Box>  
                    <Stack>
                        <Button onClick={handleClickButton} w="fit-content" gap={2}>
                            <PlusOutlined />
                            <Text>Add Review</Text>
                            {showForm ? <CaretRightOutlined /> : <CaretDownOutlined />}
                        </Button>
                        <Box display={showForm ? "block" : "none"}>
                            <ReviewForm id={id}/>
                        </Box>  
                    </Stack>
                </Box>
            </Box>
        )
    )

}