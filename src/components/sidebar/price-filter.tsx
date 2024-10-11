"use client";
import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import styles from "./price-filter.module.css"
import { useEffect, useState } from "react";
import { useSearchStore } from "@/zustand/store";


export default function PriceFilter(): JSX.Element {

    const min = 0;
    const max = 100;

    const [sliderValue, setSliderValue] = useState<number>(max);
    const setSearchParams = useSearchStore((state) => state.setSearchParams);
    const searchParams = useSearchStore((state) => state.searchParams);

    useEffect(() => {
        console.log(searchParams);
    }, [searchParams]);

    const handlePriceChange = (newPrice: number) => {
        setSliderValue(newPrice);
        setSearchParams({ max_price: newPrice })
    };


    return (

        <Box className={styles.container}>
            <Text fontWeight="bold">Price</Text>
            <Text fontWeight="bold">{min} - {sliderValue}</Text>

            <Slider onChange={handlePriceChange} min={min} max={max} defaultValue={max}>
                <SliderTrack><SliderFilledTrack /></SliderTrack>
                <SliderThumb />

            </Slider>
        </Box>

    )

}