import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Box, Text } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { useSearchParams } from "next/navigation";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { parseQueryParams } from "@/api/helpers/utils";
import { Width } from "@/redux/reducers/product";
import { useSearchStore } from "@/zustand/store";

export default function SearchResultsInfo({ showing, total }: { showing: number, total: number }): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productCount, setProductCount] = useState<number>(0);

    const setSearchParams = useSearchStore((state) => state.setSearchParams);
    const width = useSearchStore((state) => state.searchParams.width);

    const handleChangeWidth = (width: Width) => {
        setSearchParams({ width: width });
    }

    useEffect(() => {
        const searchData = parseQueryParams(searchParams);
        setIsLoading(true);
        getProductsBySearchParams(searchData).then(res => {
            if (res.metadata && res.metadata.count) {
                setProductCount(res.metadata?.count)
                setIsLoading(false);
            }
        });
    }, [searchParams])

    return ( isLoading ? <></> :
        <Box className={styles.container} bgColor={theme.colors.background.secondary}>
            <Text>Showing {Math.min(showing, productCount)} of {productCount} results</Text>
            <Box className={styles.results_container} fontSize="lg">
                <Text>Results per page</Text>
                <Text onClick={() => handleChangeWidth(Width.WIDE)} textDecoration={width === Width.WIDE ? "underline" : ""}>{Width.WIDE}</Text>
                <Text onClick={() => handleChangeWidth(Width.COMPACT)} textDecoration={width === Width.COMPACT ? "underline" : ""}>{Width.COMPACT}</Text>
            </Box>
        </Box>
    )

}