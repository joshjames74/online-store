"use client";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";
import { useSearchStore } from "@/zustand/store";
import { Heading, Select } from "@chakra-ui/react";
import { useState } from "react";

export default function SortFilter(): JSX.Element {

  const [fitler, setFilter] = useState<ProductFilter>();

  const setSearchParams = useSearchStore((state) => state.setParams);

  const handleChange = (event) => {
    setSearchParams({ product_filter: event.currentTarget.value})
  };

  return (
    <>
      <Heading fontSize="md">Sort by</Heading>
      <Select onChange={handleChange}>
        <option value={ProductFilter.PRICE_LOW_TO_HIGH}>Low to high</option>
        <option value={ProductFilter.PRICE_HIGH_TO_LOW}>High to low</option>
      </Select>
    </>
  );
}
