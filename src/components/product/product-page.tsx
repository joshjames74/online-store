"use client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Heading, HStack, Image, Select, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import styles from "./product-page.module.css"
import { ThemeContext } from "@/contexts/theme-context";
import { useContext, useEffect, useState } from "react";
import ReviewStars from "../review/review-stars";
import { postBasketItem } from "@/api/request/basketRequest";
import { CheckCircleFilled, CheckOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { UserContext } from "@/contexts/user-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductPrice } from "@/api/helpers/utils";
import { ResultType } from "@/api/helpers/types";
import ProductBasketCard from "./product-basket-card";


export default function ProductPage(product: ResultType<'product', { currency: true }>): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user, isAuthenticated } = useContext(UserContext);

    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(0);

    // define success/error message params
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(true);

    const maxQuantity = 30;

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await postBasketItem({ usrId: user.id, productId: product.id, quantity: quantity });
        } catch (error) {
            setIsSuccessful(false);
            console.error(error);
        } finally {
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1000);
            if (isSuccessful) { router.push("/user/basket") };
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
    
    <HStack margin="20px" alignItems="stretch" className={styles.container} gap="1em">

        {/** Product info */}

        <Card minW={theme.sizes.minWidth} maxW="5xl" w="full" className={styles.product_container}>   
            <CardBody>
                    <HStack h="full" alignItems="stretch" sx={{'@media screen and (max-width: 1000px)': { flexDirection: 'column'}}}>
                        {isLoading 
                        ? <Skeleton minW="300px"/>
                        : <Image minW="300px" borderRadius="md" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />
                        }
                        <Stack w="full">
                            {
                            isLoading 
                            ? <></>
                            : <>
                            <Heading>{product.title}</Heading>
                            <HStack className={styles.review_container} fontSize="lg" fontWeight="medium">
                                <Text>{product.review_score}</Text>
                                <ReviewStars fontSize="lg" value={product.review_score}/>
                                <a href="#reviews">
                                    <Text className={styles.ratings_link} _hover={{ color: theme.colors.accent.primary }}>
                                            {product.review_count} ratings
                                    </Text>
                                </a>
                            </HStack>
                            <Divider w="100%" className={styles.divider} bgColor={theme.colors.border.background}/>
                            <Heading fontSize="3xl" fontWeight="semibold">{getProductPrice(product.price, product.currency.gbp_exchange_rate, user)}</Heading>
                            <Text>{product.description}</Text>
                            </>}
                        </Stack>
                    </HStack>
            </CardBody>
        </Card>

        <ProductBasketCard props={{ id: product.id }}/>

        {/* * Basket. to do: split into separate file

        <Card minW="2xs" className={styles.basket_container} paddingX="1em">
            <CardHeader>
                <Heading fontSize="lg" fontWeight="semibold">Add to basket</Heading>
            </CardHeader>
            <Divider color={theme.colors.border.background} />
            <CardFooter>
                <Stack w="full">
                    <Select placeholder="Select quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                        {Array.from({length: maxQuantity}).map((_, index: number) => (
                            <option value={index + 1} key={index}>{index+1}</option>
                        ))}
                    </Select>
                    <Button 
                    isDisabled={!isAuthenticated}
                    rightIcon={isLoading ? <CircularProgress size="1em" isIndeterminate /> : showSuccess ? renderStatus(isSuccessful): <></>}
                    bgColor={theme.colors.accent.secondary} 
                    onClick={handleClick}>
                        {!isAuthenticated ? "Sign in to add to basket" : "Add to basket"}
                    </Button>
                    <Button bgColor={theme.colors.accent.primary}>Buy now</Button>
                </Stack>
            </CardFooter>
        </Card> */}
    </HStack>
    )

}
