import { ProductFilter } from "@/api/transformers/productSearchTransformer";
import { useSearchParamsState } from "@/zustand/store";
import { Heading, Select } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler } from "react";

export default function SortFilter(): JSX.Element {
  const updateProductFilter = useSearchParamsState(
    (state) => state.updateProductFilter,
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateProductFilter(parseInt(event.currentTarget.value));
  };

  return (
    <>
      <Heading fontSize="md">Sort by</Heading>
      <Select onChange={(event) => handleChange(event)}>
        <option value={ProductFilter.PRICE_LOW_TO_HIGH}>Low to high</option>
        <option value={ProductFilter.PRICE_HIGH_TO_LOW}>High to low</option>
      </Select>
    </>
  );
}
