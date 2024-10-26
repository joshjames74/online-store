import { Box, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Heading, HStack, Image, Select, Stack, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import styles from "./product-page.module.css"
import { ThemeContext } from "@/contexts/theme-context";
import { useContext, useEffect, useState } from "react";
import ReviewStars from "../review/review-stars";
import { postBasketItem } from "@/api/request/basketRequest";
import { CheckCircleFilled, CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";


export default function ProductPage(product: Product): JSX.Element {

    const { theme } = useContext(ThemeContext);


    const [quantity, setQuantity] = useState<number>(0);


    // define success/error message params
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(true);

    const usrId = 1;
    const maxQuantity = 30;
    const isInStock = true;


    const handleClick = async () => {
        setIsLoading(true);
        try {
            await postBasketItem({ usrId: usrId, productId: product.id, quantity: quantity });
        } catch (error) {
            setIsSuccessful(false);
            console.log(error);
        } finally {
            setIsLoading(false);
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 1000);
        }
    }

    const renderStatus = (successful: boolean): JSX.Element => {
        return (
            <Box color={successful ? theme.colors.semantic.success : theme.colors.semantic.error}>
                {successful ? <CheckCircleFilled  /> : <CloseCircleOutlined />}
            </Box>
        )
    }


    return (
    
    <Box margin="20px" alignItems="stretch" className={styles.container}>

        {/** Product info */}

        <Card minW="sm" w="full" className={styles.product_container}>   
            <CardBody>
                    <HStack h="full" alignItems="stretch" sx={{'@media screen and (max-width: 600px)': { flexDirection: 'column'}}}>
                        <Image minW="300px" borderRadius="md" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
                        <Stack w="full">
                            <Heading>{product.title}</Heading>
                            <HStack className={styles.review_container} fontSize="lg">
                                <Text>{product.review_score}</Text>
                                <ReviewStars fontSize="lg" value={product.review_score}/>
                                <Text className={styles.ratings_link} _hover={{ color: theme.colors.accent.primary }}>
                                        {product.review_count} ratings
                                </Text>
                            </HStack>
                            <Divider w="100%" className={styles.divider} bgColor={theme.colors.border.background}/>
                            <Heading fontSize="3xl" fontWeight="normal">£{product.price}</Heading>
                            <Text>{product.description}</Text>
                        </Stack>
                    </HStack>
            </CardBody>
        </Card>

        {/** Basket */}

        <Card minW="sm" className={styles.basket_container}>
            <CardHeader>
                <Heading fontSize="lg" fontWeight="semibold">Add to basket</Heading>
            </CardHeader>

            <CardBody>
                <Text color={theme.colors.semantic.success}>{isInStock ? "In stock" : "Out of stock"}</Text>
            </CardBody>

            <CardFooter>
                <Stack w="full">
                    <Select placeholder="Select quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                        {Array.from({length: maxQuantity}).map((_, index: number) => (
                            <option value={index + 1} key={index}>{index+1}</option>
                        ))}
                    </Select>
                    <Button 
                    rightIcon={isLoading ? <CircularProgress size="1em" isIndeterminate /> : showSuccess ? renderStatus(isSuccessful): <></>}
                    bgColor={theme.colors.accent.secondary} 
                    onClick={handleClick}>
                        Add to basket
                    </Button>
                    <Button bgColor={theme.colors.accent.primary}>Buy now</Button>
                </Stack>
            </CardFooter>
        </Card>
    </Box>
    )

}
// export default function ProductPage(product: Product): JSX.Element {

//     const { theme } = useContext(ThemeContext);

//     return (
    
//         <Box className={styles.container}>
//             <Image 
//             className={styles.image}
//             src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
//             <Box className={styles.body}>

//                 <Text className={styles.title}>{product.title}</Text>

//                 <Box className={styles.review_container}>
//                     <Text>{product.review_score}</Text>
//                     <ReviewStars value={product.review_score} fontSize="xl"/>
//                     <Text 
//                         className={styles.ratings_link} 
//                         _hover={{ color: theme.colors.accent.primary }}
//                         fontSize="lg">
//                             {product.review_count} ratings
//                     </Text>
//                 </Box>

//                 <Divider 
//                     className={styles.divider} 
//                     bgColor={theme.colors.border.background}/>

//                 <Text fontSize="2xl">{product.price}</Text>
//                 <Text>{product.description}</Text>
                
//             </Box>
//         </Box>

//     )

// }

