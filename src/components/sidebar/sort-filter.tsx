import { Heading, Select } from "@chakra-ui/react";

export default function SortFilter(): JSX.Element {
    return (
        <>
        <Heading fontSize="md">Sort by</Heading>
        <Select>
            <option>Low to high</option>
        </Select>
        </>
    )
}