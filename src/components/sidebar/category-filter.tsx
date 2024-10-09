import { Box, Checkbox, InputGroup, Text } from "@chakra-ui/react";
import styles from "./category-filter.module.css"

export default function CategoryFilter(): JSX.Element {

    return (

        <Box className={styles.container}>
            
            <Text fontWeight="bold">Categories</Text>

            <Box className={styles.checkbox_container}>
                <Checkbox>Category 1</Checkbox>
                <Checkbox>Category 2</Checkbox>
            </Box>

        </Box>

    )

}