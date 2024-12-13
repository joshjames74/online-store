"use client";
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import styles from "./price-filter.module.css";
import { useEffect } from "react";
import { useSearchParamsState, useSearchResultsState, useUserState } from "@/zustand/store";
import {
  convertAndFormatToUserCurrency,
} from "@/api/helpers/utils";


export default function PriceFilter(): JSX.Element {
  // logic:
  // slider value: on reads from the maxPrice
  // onChange updates the max price only
  // when we have a new max price data, update the max price

  const currency = useUserState((state) => state.currency);

  const min: number = 0;
  const updateMaxPrice = useSearchParamsState((state) => state.updateMaxPrice);
  const maxPrice = useSearchParamsState((state) => state.params.max_price);
  const maxPriceData = useSearchResultsState((state) => state.maxPrice);

  useEffect(() => {
    updateMaxPrice(maxPriceData);
  }, [maxPriceData]);

  useEffect(() => {
    if (maxPrice === 0) {
      updateMaxPrice(maxPriceData);
    }
  }, [maxPrice]);

  return (
    <Box className={styles.container}>
      <Text fontWeight="bold">Price</Text>
        <Text fontWeight="semibold">
          {convertAndFormatToUserCurrency(min, currency)}-
          {convertAndFormatToUserCurrency(maxPrice || 0, currency)}
        </Text>
        <Slider
          onChange={(newPrice: number) => updateMaxPrice(newPrice)}
          min={min}
          max={maxPriceData}
          value={maxPrice}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
    </Box>
  );
}
