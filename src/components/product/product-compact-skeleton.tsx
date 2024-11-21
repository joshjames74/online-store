import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";
import styles from "./product-compact.module.css";

export default function ProductCompactSkeleton(): JSX.Element {
  return (
    <Box className={styles.container}>
      <Skeleton className={styles.image} />
      <Box className={styles.info_container}>
        <SkeletonText noOfLines={4} />
      </Box>
    </Box>
  );
}
