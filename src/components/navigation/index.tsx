import { Box, Button, Image } from "@chakra-ui/react";
import styles from "./index.module.css";
import DeliveryButton from "./delivery-button";
import SearchBar from "./search-bar";
import Link from "next/link";

export default function NavBar(): JSX.Element {

    const userId = 1;

    return (
        <Box className={styles.container}>
            <Image className={styles.min_width_500} />
            <DeliveryButton />
            <SearchBar />
            <Button className={styles.min_width_500}>Account</Button>
            <Link href={`/user/${userId}/basket`} className={styles.min_width_500}>
                <Button>Basket</Button>
            </Link>
        </Box>
    )

}