"use client";
import { Box, HStack, Input, InputGroup, InputLeftAddon, InputRightElement, Select, Stack, } from "@chakra-ui/react";
import styles from "./search-bar.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchStore } from "@/zustand/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/api/request/categoryRequest";
import { parseQueryParams } from "@/api/helpers/utils";


export default function SearchBar(): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [query, setQuery] = useState<string>('');

    const setSearchParams = useSearchStore((state) => state.setParams);
    const getURLSearchParams = useSearchStore((state) => state.getURLSearchParams);
    
    
    useEffect(() => {

        setIsLoading(true);

        getAllCategories().then(res => {
            setCategories(res);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false)
        });

        // if only one category, set as selected
        const searchCategories = parseQueryParams(searchParams).categories;
        if (searchCategories.length === 1) {
            setSelectedCategory(searchCategories[0])
        };

    }, [])

    useEffect(() => {
        setSearchParams({ query: query});
    }, [query]);

    const updateURL = () => {
        // search bar category overrides all other categories, so is set last
        if (selectedCategory) { setSearchParams({ categories: [selectedCategory]})}
        // set page back to 1
        setSearchParams({ pageNumber: 1 });
        router.push(`/?${getURLSearchParams()} `); 
    }

    return (
        <Box className={styles.container}>
        <InputGroup className={styles.input_container} bgColor={theme.colors.background.primary} color={theme.colors.text.primary}>
            <InputLeftAddon className={styles.input_left_addon} maxW="200px" textOverflow="ellipsis"> 
                <Select 
                    onChange={e => setSelectedCategory(parseInt(e.target.value || ''))}
                    placeholder="All"
                    className={styles.select_container}
                    variant="unstyled"
                    value={selectedCategory}
                    textOverflow="ellipsis">
                    {isLoading || !categories.length ? <></> : categories.map((category, index) => {
                        return (
                            <option key={index} value={category.id}>{category.name}</option> 
                        )
                    })}
                </Select>
            </InputLeftAddon>
            <Input placeholder="Search" onChange={e => setQuery(e.target.value)} />
            <InputRightElement onClick={() => updateURL()} bgColor={theme.colors.accent.primary} color={theme.colors.text.secondary} maxW="fit-content" paddingX="1em">
                <SearchOutlined />
            </InputRightElement>
        </InputGroup>
        </Box>
    )

    // return (
    //     <>
    //     <form>
    //         <HStack>

    //             <Select 
    //                 onChange={e => setSelectedCategory(parseInt(e.target.value || ''))}
    //                 placeholder="All"
    //                 className={styles.select_container}
    //                 variant="unstyled"
    //                 value={selectedCategory}>
    //                 {isLoading || !categories.length ? <></> : categories.map((category, index) => <option key={index} value={category.id}>{category.name}</option>)}
    //             </Select>

    //             <input 
    //             placeholder="Search"
    //             onChange={e => setQuery(e.target.value)}
    //             width="full"  />

    //             <Box 
    //             onClick={() => updateURL()} bgColor={theme.colors.accent.primary} color={theme.colors.text.secondary} maxW="fit-content" paddingX="1em">
    //                 <SearchOutlined />
    //             </Box>

    //         </HStack>
    //     </form>
    //     </>
    // )
}