import { Box, Divider, Heading, Image, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import styles from "./product-page-skeleton.module.css"

export default function ProductPageSkeleton(): JSX.Element {

    return (
    
        <Box className={styles.container}>

            <Skeleton className={styles.image_skeleton} />

            <Box className={styles.body}>

                <Skeleton className={styles.title} />
                <Skeleton className={styles.review_container}/>
            
                <Divider className={styles.divider} />

                <SkeletonText noOfLines={10}/>
                
            </Box>
        </Box>

    )

}