import { Box, Button, Image } from "@chakra-ui/react";
import styles from "./index.module.css";
import DeliveryButton from "./delivery-button";
import SearchBar from "./search-bar";
import Link from "next/link";
import AccountButton from "./account-button";
import CurrencyCountryButton from "./currency-country-button";


export default function NavBar(): JSX.Element {

    return (
        <Box className={styles.container}>
            <Image className={styles.min_width_500} />
            <DeliveryButton />
            <SearchBar />
            <CurrencyCountryButton />
            <AccountButton />
            <Link href={"/user/basket"} className={styles.min_width_500}>
                <Button>Basket</Button>
            </Link>
        </Box>
    )

}