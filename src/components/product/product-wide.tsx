import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Image, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-wide.module.css";

export default function ProductWide(): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const image_url = "";
    const fallback = "";
    const alt = "";
    const displayPrice = 10;
    const displayReview = 10;
    const product = {
        title: "title",
        description: "description",
    }

    return (
        <Link href="">
            <Box className={styles.container} borderColor={theme.colors.background}>
                <Image className={styles.image} src={image_url} fallbackSrc={fallback} 
                    alt={alt}  />
                <Box className={styles.info_container}>
                <Box className={styles.title_wrapper}>
                    <Text noOfLines={2}>{product.title}</Text>
                </Box>
                <Box className={styles.price_review_container}>
                    <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>
                    {displayPrice}
                    </Text>
                    <Box className={styles.review_wrapper}>
                    {/* <ReviewStars reviewScore={product.review_score} /> */}
                    <Text className={styles.review_score}>{displayReview}</Text>
                    </Box>
                </Box>
                <Box className={styles.description_container}>
                    <Text className={styles.description} noOfLines={1}>
                    {product.description}
                    </Text>
                </Box>
                </Box>
            </Box>
        </Link>
    )
}