"use client";
import { Input, InputGroup, InputLeftAddon, InputRightElement, Select, } from "@chakra-ui/react";
import styles from "./search-bar.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { SearchOutlined } from "@ant-design/icons";


export default function SearchBar(): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <InputGroup className={styles.container} bgColor={theme.colors.background.secondary} color={theme.colors.text.primary}>
            <InputLeftAddon className={styles.input_left_addon}>
                <Select placeholder="All" className={styles.select_container} variant="unstyled">
                    <option className={styles.select_option}>Category 1</option>
                    <option className={styles.select_option}>Category 2</option>
                </Select>
            </InputLeftAddon>
            <Input placeholder="Search" />
            <InputRightElement bgColor={theme.colors.accent.primary} color={theme.colors.text.secondary} >
                <SearchOutlined />
            </InputRightElement>
        </InputGroup>
    )
}