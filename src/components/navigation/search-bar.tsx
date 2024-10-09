import { Input, InputGroup, InputRightElement, } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import styles from "./search-bar.module.css";


export default function SearchBar(): JSX.Element {
    return (
        <InputGroup className={styles.container} bgColor="gray" textColor="white">
            <Input placeholder="Search"/>
            <InputRightElement color="orange" className={styles.right_element}>
                {/* <SearchIcon /> */}
            </InputRightElement>
        </InputGroup>
    )
}