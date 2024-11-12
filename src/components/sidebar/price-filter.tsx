"use client";
import { Box, SkeletonText, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import styles from "./price-filter.module.css"
import { useContext, useEffect, useState } from "react";
import { useSearchStore } from "@/zustand/store";
import { formatPrice, getProductPrice, parseQueryParams } from "@/api/helpers/utils";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { ModelsResponse } from "@/api/helpers/types";
import { UserContext } from "@/contexts/user-context";


export default function PriceFilter(): JSX.Element {

    const min = 0;

    const [sliderValue, setSliderValue] = useState<number>();
    const [maxPrice, setMaxPrice] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useContext(UserContext);

    const setSearchParams = useSearchStore((state) => state.setParams);


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
                    <Text fontWeight="semibold">
                        {getProductPrice(min, user && user.currency ? user.currency.gbp_exchange_rate : 1, user)}
                        - 
                        {formatPrice((sliderValue || 0) / user.currency.gbp_exchange_rate, user.currency.code)}
                    </Text>
                    <Slider onChange={handlePriceChange} min={min} max={maxPrice} defaultValue={maxPrice}>
                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                        <SliderThumb />
                    </Slider>
                </>
            )}
        </Box>

    )

}