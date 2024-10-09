import { Box, Button, Text } from "@chakra-ui/react";
import styles from "./delivery-button.module.css";
import { EnvironmentOutlined } from "@ant-design/icons";


export default function DeliveryButton(): JSX.Element {

    const address = { name: "John Work", postCode: "AB12 4BA", city: "Cardiff"}

    return (
    <Button className={styles.container}>
        <EnvironmentOutlined color={"black"}/>
        <Box className={styles.text_container}>
            <Text className={styles.deliver_to}>Deliver To {address.name}</Text>
            <Text className={styles.address}>{address.city} {address.postCode}</Text>
        </Box>
    </Button>
    )
}