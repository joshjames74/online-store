import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Card, CardBody, Grid, GridItem, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-wide.module.css";
import { Product } from "@prisma/client";
import ProductReviewBox from "./product-review-box";
import { ResultType } from "@/api/helpers/types";
import { convertPrice, formatPrice, getProductPrice } from "@/api/helpers/utils";
import { UserContext } from "@/contexts/user-context";


// export default function ProductWide({...product}: Product): JSX.Element {

//     const { theme } = useContext(ThemeContext);

//     return (
//         <Link href={`/product/${product.id}`}>
//             <Box className={styles.container} borderColor={theme.colors.background}>
//                 <Image className={styles.image} src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" alt={product.image_alt}  />
//                 <Box className={styles.info_container}>
//                     <Text noOfLines={1}>{product.title}</Text>
//                     <ProductReviewBox {...product} />
//                     <Text className={styles.price_wrapper} color={theme.colors.accent.primary}>{product.price}</Text>
//                     <Text className={styles.description} fontSize="xs" noOfLines={1}>{product.description}</Text>
//                 </Box>
//             </Box>
//         </Link>
//     )
// }


export default function ProductWide({...product}: ResultType<'product', { currency: true }>): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    if (!product.currency) {
        console.log(product);
        return <></>
    }

    return (
        <Link href={`/product/${product.id}`}>
            <Card maxW="xl">
                <CardBody>
                    <Grid templateColumns="minmax(150px, 1fr) 1fr" gap={2}>
                        <GridItem colSpan={1}>
                            <Image objectFit="cover" h="auto" w="100%" borderRadius="md" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" alt={product.image_alt}  />
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Stack gap={1}>
                                <Heading noOfLines={1}>{product.title}</Heading>
                                <ProductReviewBox {...product} />
                                <Heading fontSize="lg" color={theme.colors.accent.tertiary}>
                                    {getProductPrice(product.price, product.currency.gbp_exchange_rate, user)}
                                </Heading>
                                <Text fontSize="xs" noOfLines={1}>{product.description}</Text>
                            </Stack>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        </Link>
    )
}

