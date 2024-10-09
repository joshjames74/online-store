import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import styles from "./price-filter.module.css"
import { useState } from "react";


export default function PriceFilter(): JSX.Element {

    const min = 0;
    const max = 100;

    const [sliderValue, setSliderValue] = useState<number>(max);
    const onChange = (val: number) => setSliderValue(val);


    return (

        <Box className={styles.container}>
            <Text fontWeight="bold">Price</Text>
            <Text fontWeight="bold">{min} - {sliderValue}</Text>

            <Slider onChange={onChange} min={min} max={max} defaultValue={max}>
                <SliderTrack><SliderFilledTrack /></SliderTrack>
                <SliderThumb />

            </Slider>
        </Box>

    )

}