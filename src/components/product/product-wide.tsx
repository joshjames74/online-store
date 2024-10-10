import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Image, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-wide.module.css";
import { Product } from "@prisma/client";
import ProductReviewBox from "./product-review-box";


export default function ProductWide({...product}: Product): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <Link href="">
            <Box className={styles.container} borderColor={theme.colors.background}>
                {/* <Image className={styles.image} src={product.image_url} alt={product.image_alt}  /> */}
                <Box className={styles.image}>Image</Box>
                <Box className={styles.info_container}>
                    <Text noOfLines={1}>{product.title}</Text>
                    <ProductReviewBox {...product} />
                    <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>{product.price}</Text>
                    <Text className={styles.description} fontSize="xs" noOfLines={1}>{product.description}</Text>
                </Box>
            </Box>
        </Link>
    )
}