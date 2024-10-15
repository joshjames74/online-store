import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import styles from "./review-card.module.css";


export default function ReviewCardSkeleton(): JSX.Element {

    return (
        <Box className={styles.container}>
            <Box className={styles.user_container}>
                <SkeletonCircle />
            </Box>
            <SkeletonText noOfLines={5} />
        </Box>

    )

}