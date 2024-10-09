import { Box, Button, Image } from "@chakra-ui/react";
import styles from "./index.module.css";
import DeliveryButton from "./delivery-button";
import SearchBar from "./search-bar";

export default function NavBar(): JSX.Element {

    return (
        <Box className={styles.container}>
            <Image  />
            <DeliveryButton />
            <SearchBar />
            <Button>Account</Button>
            <Button>Basket</Button>
        </Box>
    )

}