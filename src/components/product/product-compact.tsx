import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-compact.module.css";
import { Product } from "@prisma/client";
import ReviewStars from "../review/review-stars";


export default function ProductCompact({...product}: Product): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <Link href="">
            <Box className={styles.container} borderColor={theme.colors.background}>
                <Image className={styles.image} src={product.image_url} alt={product.image_alt}  />
                <Box className={styles.info_container}>
                    <Text noOfLines={1}>{product.title}</Text>
                    <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>{product.price}</Text>
                    <Box className={styles.review_wrapper}>
                        <ReviewStars value={product.review_score}></ReviewStars>
                        <Text className={styles.review_score} fontSize="xs">{product.review_score} reviews</Text>
                    </Box>
                </Box>
            </Box>
        </Link>
    )
}