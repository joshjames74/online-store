"use client";
import { Input, InputGroup, InputLeftAddon, InputRightElement, Select, } from "@chakra-ui/react";
import styles from "./search-bar.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/api/request/categoryRequest";


export default function SearchBar(): JSX.Element {

    const { theme } = useContext(ThemeContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getAllCategories().then(res => {
            setCategories(res);
            setIsLoading(false);
        })
    }, [])

    const router = useRouter();

    const urlSearchParams = useSearchStore((state) => state.getURLSearchParams);

    const updateURL = () => {
        const params = urlSearchParams();
        router.push(`?${params}`); 
    }

    return (
        <InputGroup className={styles.container} bgColor={theme.colors.background.secondary} color={theme.colors.text.primary}>
            <InputLeftAddon className={styles.input_left_addon}>
                <Select placeholder="All" className={styles.select_container} variant="unstyled">
                    {isLoading ? <></> : categories.map((category) => <option>{category.name}</option>)}
                </Select>
            </InputLeftAddon>
            <Input placeholder="Search" />
            <InputRightElement onClick={() => updateURL()}bgColor={theme.colors.accent.primary} color={theme.colors.text.secondary} >
                <SearchOutlined />
            </InputRightElement>
        </InputGroup>
    )
}