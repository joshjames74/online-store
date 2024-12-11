import { ProductFilter } from "@/api/transformers/productSearchTransformer";
import { useSearchParamsState } from "@/zustand/store";
import { Heading, Select } from "@chakra-ui/react";


export default function SortFilter(): JSX.Element {
  const updateProductFilter = useSearchParamsState((state) => state.updateProductFilter);

  const handleChange = (event) => {
    updateProductFilter(event.currentTarget.value);
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
