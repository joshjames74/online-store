import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Box, Heading, HStack, Select, Text } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { useSearchParams } from "next/navigation";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { parseQueryParams } from "@/api/helpers/utils";
import { Width } from "@/redux/reducers/product";
import { useSearchStore } from "@/zustand/store";
import { ProductFilter } from "@/api/transformers/productSearchTransformer";



export default function SearchResultsInfo({ showing, total }: { showing: number, total: number }): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const setSearchParams = useSearchStore((state) => state.setParams);
    const params = useSearchStore((state) => state.params);
    const resultsCount = useSearchStore((state) => state.resultsCount);

    const width = useSearchStore((state) => state.params.width);

    const handleChangeWidth = (width: Width) => {
        setSearchParams({ width: width });
    }


    const lowerBound: number = params.skip ? params.skip + 1 : 1;
    const upperBound: number = params.take ? lowerBound + params.take : 1;

    return ( isLoading ? <></> :
        <HStack bgColor={theme.colors.accent.tertiary} justify="space-between" padding="1em">
            <Heading className={styles.heading}>Showing {lowerBound} - {upperBound} of {resultsCount} results</Heading>
            <HStack gap={2}>
                <HStack fontSize="lg">
                    <Heading className={styles.heading}>Results per page</Heading>
                    <Heading className={styles.heading} onClick={() => handleChangeWidth(Width.WIDE)} textDecoration={width === Width.WIDE ? "underline" : ""}>
                        {Width.WIDE}
                    </Heading>
                    <Heading className={styles.heading} onClick={() => handleChangeWidth(Width.COMPACT)} textDecoration={width === Width.COMPACT ? "underline" : ""}>{Width.COMPACT}</Heading>
                </HStack>
                {/* <Select placeholder="Filter by">
                    {Object.keys(ProductFilter).map((val, index: number) => <option key={index}>{val}</option>)}
                </Select> */}
            </HStack>
        </HStack>
    )

}