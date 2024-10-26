import { ThemeContext } from "@/contexts/theme-context";
import { Card, CardBody, CardFooter, CardHeader, Divider, Heading, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { Address } from "@prisma/client";
import { useContext } from "react";
import styles from "./address-card.module.css";

export default function AddressCard(address: Address, isDefault?: boolean): JSX.Element {

    const { theme } = useContext(ThemeContext);

    return (
        <Card w="350px" h="250px" borderRadius="1em">

            <CardBody>
                <Stack gap="0.1em">
                    <Heading fontSize="md">{address.name}</Heading>
                    <Text>{address.number}</Text>
                    <Text>{address.street}</Text>
                    <Text>{address.area_code}</Text>
                </Stack>
            </CardBody>

            <CardFooter>
                <HStack color={theme.colors.accent.tertiary} gap="1em">
                    <Text className={styles.button}>Edit</Text>
                    <span>|</span>
                    <Text className={styles.button}>Remove</Text>
                    <span>|</span>
                    <Text className={styles.button}>Set as default</Text>
                </HStack>
            </CardFooter>

        </Card>

    )

}