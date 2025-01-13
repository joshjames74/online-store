"use client";
import {
  Box,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import {
  useSearchParamsState,
  useSearchResultsState,
  useUserState,
} from "@/zustand/store";
import { convertAndFormatToUserCurrency } from "@/api/helpers/utils";
import "./index.module.css";

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
    <Box paddingRight="1em">
      <Heading as="h3" className="upper" marginBottom="0.4em">
        Price
      </Heading>
      <Text as="h5">
        Under {convertAndFormatToUserCurrency(maxPrice || 0, currency)}
      </Text>
      <Slider
        onChange={(newPrice: number) => updateMaxPrice(newPrice)}
        min={min}
        max={maxPriceData}
        value={maxPrice}
      >
        <SliderTrack>
          <SliderFilledTrack bgColor="var(--muted-text)" />
        </SliderTrack>
        <SliderThumb borderColor="var(--primary-text)" borderWidth="2px" />
      </Slider>
    </Box>
  );
}
