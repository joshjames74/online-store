import { Box, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import styles from "./review-summary.module.css";

export default function ReviewSummarySkeleton(): JSX.Element {

    return (

        <Box className={styles.container}>
            <Box className={styles.stars_container}>
                {Array.from({ length: 6}).map(() => (
                    <SkeletonText noOfLines={1}/>
                ))}
            </Box>
        </Box>


    )
}