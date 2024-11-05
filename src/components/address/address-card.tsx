import { ThemeContext } from "@/contexts/theme-context";
import { Card, CardBody, CardFooter, CardHeader, Divider, Heading, HStack, Stack, Tag, Text, useToast } from "@chakra-ui/react";
import { Address } from "@prisma/client";
import { useContext } from "react";
import styles from "./address-card.module.css";
import { deleteAddressById } from "@/api/request/addressRequest";
import { useRouter } from "next/navigation";

export default function AddressCard(address: Address, isDefault?: boolean): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const toast = useToast();

    const onDeleteSuccess = () => { toast({ title: "Deleted address successfully", status: "success", duration: 1000 })};
    const onDeleteError = () => { toast({ title: "Error deleting address", status: "error", duration: 5000 })};

    const handleDelete = () => {
        deleteAddressById(address.id).then(res => {
            onDeleteSuccess();
            location.reload();
        }).catch(error => {
            console.log(error);
            onDeleteError();
        })
    }

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
                    <Text className={styles.button} onClick={handleDelete} _hover={{ cursor: "pointer" }}>Remove</Text>
                    <span>|</span>
                    <Text className={styles.button}>Set as default</Text>
                </HStack>
            </CardFooter>

        </Card>

    )

}