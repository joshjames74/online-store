import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Card, CardBody, Center, Grid, GridItem, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-compact.module.css";
import { Product } from "@prisma/client";
import ReviewStars from "../review/review-stars";


// export default function ProductCompact({...product}: Product): JSX.Element {

//     const { theme } = useContext(ThemeContext);

//     return (
//         <Link href={`/product/${product.id}`}>
//             <Box className={styles.container} borderColor={theme.colors.background}>
//                 <Image className={styles.image} src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
//                 <Box className={styles.info_container}>
//                     <Text noOfLines={1}>{product.title}</Text>
//                     <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>{product.price}</Text>
//                     <Box className={styles.review_wrapper}>
//                         <ReviewStars value={product.review_score}></ReviewStars>
//                         <Text fontSize="xs" fontWeight="bold">{product.review_score.toPrecision(2).toString()}</Text>
//                         <Text className={styles.review_score} fontSize="xs">({product.review_count})</Text>
//                     </Box>
//                 </Box>
//             </Box>
//         </Link>
//     )
// }

export default function ProductCompact({...product}: Product): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <Link href={`/product/${product.id}`}>
            <Card maxW="sm" w="200px">
                <CardBody>
                    <Stack>
                            <Image w="100%" h="150px" objectFit="cover" borderRadius="md" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
                            <Heading noOfLines={1} fontSize="lg">{product.title}</Heading>
                            <Heading fontSize="md" color={theme.colors.accent.primary}>£{product.price}</Heading>
                            <HStack gap={1}>
                                <ReviewStars value={product.review_score}></ReviewStars>
                                <Text fontSize="xs" fontWeight="bold">{product.review_score.toPrecision(2).toString()}</Text>
                                <Text fontSize="xs">({product.review_count})</Text>
                            </HStack>
                    </Stack>
                </CardBody>  
            </Card>
        </Link>
    )
}