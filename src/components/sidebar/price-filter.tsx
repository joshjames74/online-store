"use client";
import { Box, SkeletonText, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import styles from "./price-filter.module.css"
import { useEffect, useState } from "react";
import { useSearchStore } from "@/zustand/store";
import { useSearchParams } from "next/navigation";
import { parseQueryParams } from "@/api/helpers/utils";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { ModelsResponse } from "@/api/helpers/types";


export default function PriceFilter(): JSX.Element {

    const min = 0;

    const [sliderValue, setSliderValue] = useState<number>();
    const [maxPrice, setMaxPrice] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const setSearchParams = useSearchStore((state) => state.setSearchParams);


    useEffect(() => {

        // set the max price when no filters are applied

        setIsLoading(true);
        getProductsBySearchParams({}).then((res: ModelsResponse<'product'>) => {
            if (res.metadata && res.metadata["price"]) {
                setMaxPrice(res.metadata["price"]?.max);
            }
            setIsLoading(false);
        })
    }, []);

    useEffect(() => {
        setSliderValue(maxPrice)
    }, [maxPrice]);

    const handlePriceChange = (newPrice: number) => {
        setSliderValue(newPrice);
        setSearchParams({ max_price: newPrice })
    };


    return (

        <Box className={styles.container}>
            <Text fontWeight="bold">Price</Text>
            {isLoading ? <SkeletonText noOfLines={2}/> : (
                <>
                    <Text fontWeight="semibold">£{min} - £{sliderValue}</Text>
                    <Slider onChange={handlePriceChange} min={min} max={maxPrice} defaultValue={maxPrice}>
                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                        <SliderThumb />
                    </Slider>
                </>
            )}
        </Box>

    )

}