import { Box, Button, Image } from "@chakra-ui/react";
import styles from "./index.module.css";
import DeliveryButton from "./delivery-button";
import SearchBar from "./search-bar";

export default function NavBar(): JSX.Element {

    return (
        <Box className={styles.container}>
            <Image className={styles.min_width_500} />
            <DeliveryButton />
            <SearchBar />
            <Button className={styles.min_width_500}>Account</Button>
            <Button className={styles.min_width_500}>Basket</Button>
        </Box>
    )

}