import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Box, Text } from "@chakra-ui/react";
import styles from "./search-results-info.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";

export default function SearchResultsInfo({ showing, total }: { showing: number, total: number }): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <Box className={styles.container} bgColor={theme.colors.background.secondary}>
            <Text>Showing {showing} of {total} results</Text>
            <Box className={styles.results_icons_container} fontSize="lg">
                <BarsOutlined />
                <AppstoreOutlined />
            </Box>
        </Box>
    )

}