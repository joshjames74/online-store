import { Button } from "@chakra-ui/react";
import styles from "./index.module.css";

export default function DeliveryButtonLoggedOut(): JSX.Element {
    return <Button className={styles.text_button}>Create address</Button>
}