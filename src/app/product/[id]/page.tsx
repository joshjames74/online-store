"use client";
import { getProductById } from "@/api/request/productRequest";
import ProductPage from "@/components/product/product-page";
import ProductPageSkeleton from "@/components/product/product-page-skeleton";
import ReviewCard from "@/components/review/review-card";
import ReviewGrid from "@/components/review/review-grid";
import { Box } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string }}): JSX.Element {

    const { id } = params;

    const [product, setProduct] = useState<Product>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        getProductById(parseInt(id)).then(res => {
            setProduct(res)
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    
    if (!id || isNaN(parseInt(id))) {
        //redirect to 404
        return <Box>Page not found</Box>
    }


    return (
        <Box>
            {isLoading || !product ? <ProductPageSkeleton /> 
            : <ProductPage {...product}/>}
            <ReviewGrid id={parseInt(id)} score={product?.review_score ? product?.review_score : 0} />
        </Box>
    )
};

