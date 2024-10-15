import { Box, Divider, Heading, Image, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import styles from "./product-page.module.css"
import { ThemeContext } from "@/contexts/theme-context";
import { useContext } from "react";
import ReviewStars from "../review/review-stars";

export default function ProductPage(product: Product): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
    
        <Box className={styles.container}>
            <Image 
            className={styles.image}
            src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
            <Box className={styles.body}>

                <Text className={styles.title}>{product.title}</Text>

                <Box className={styles.review_container}>
                    <Text>{product.review_score}</Text>
                    <ReviewStars value={product.review_score} fontSize="xl"/>
                    <Text 
                        className={styles.ratings_link} 
                        _hover={{ color: theme.colors.accent.primary }}
                        fontSize="lg">
                            {product.review_count} ratings
                    </Text>
                </Box>

                <Divider 
                    className={styles.divider} 
                    bgColor={theme.colors.border.background}/>

                <Text fontSize="2xl">{product.price}</Text>
                <Text>{product.description}</Text>
                
            </Box>
        </Box>

    )

}