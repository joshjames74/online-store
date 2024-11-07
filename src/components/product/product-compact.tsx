import { ThemeContext } from "@/contexts/theme-context"
import Link from "next/link";
import { Box, Card, CardBody, Center, Grid, GridItem, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./product-compact.module.css";
import { Product } from "@prisma/client";
import ReviewStars from "../review/review-stars";
import { ResultType } from "@/api/helpers/types";
import { getProductPrice } from "@/api/helpers/utils";
import { UserContext } from "@/contexts/user-context";
import { SettingsContext } from "@/contexts/settings-context";


export default function ProductCompact({...product}: ResultType<'product', { currency: true }>): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const { defaultImageUrl } = useContext(SettingsContext); 

    return (
        <Link href={`/product/${product.id}`}>
            <Card maxW="sm" w="200px">
                <CardBody>
                    <Stack>
                        <Image w="100%" h="150px" objectFit="cover" borderRadius="md" src={defaultImageUrl} />
                        <Heading noOfLines={1} fontSize="lg">{product.title}</Heading>
                        <Heading fontSize="md" color={theme.colors.accent.tertiary}>{getProductPrice(product.price, product.currency.gbp_exchange_rate, user)}</Heading>
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