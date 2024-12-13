import { ThemeContext } from "@/contexts/theme-context";
import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Address } from "@prisma/client";
import { useContext } from "react";
import styles from "./address-card.module.css";
import {
  deleteAddressById,
  getAddressesByUserId,
} from "@/api/request/addressRequest";
import { putUserDefaultAddress } from "@/api/request/userRequest";


export default function AddressCard(
  address: Address,
  isDefault?: boolean,
): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const toast = useToast();

  const handleDelete = () => {
    const pendingToast = toast({
      title: "Deleting address...",
      status: "loading",
    });
    deleteAddressById(address.id)
      .then((res) => {
        // reload cached addresses
        getAddressesByUserId(address.usrId, "reload")
          .then(() => {})
          .catch((error) => console.error(error));
        // display success
        toast.update(pendingToast, {
          title: "Deleted address successfully",
          status: "success",
          duration: 1000,
        });
        location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.update(pendingToast, {
          title: "Error deleting address",
          status: "error",
          duration: 5000,
        });
      });
  };

  const handleDefault = () => {
    const userId = address.usrId;
    const addressId = address.id;
    const params = { userId, addressId };
    putUserDefaultAddress(userId, addressId)
      .then((res) => {
        getAddressesByUserId(address.usrId, "reload")
          .then(() => {})
          .catch((error) => console.error(error));
      })
      .catch(error => console.error(error));
  };

  return (
    <Card w="300px" h="250px" borderRadius="1em">
      <CardBody paddingBottom={0}>
        <Stack gap="0.1em">
          <Heading fontSize="md" noOfLines={2}>
            {address.name}{address.isDefault ? "[DEFAULT]" : ""}
          </Heading>
          <Text noOfLines={3}>{address.address_line_1}</Text>
          <Text noOfLines={2}>{address.address_line_2}</Text>
          <Text noOfLines={1}>{address.area_code}</Text>
        </Stack>
      </CardBody>

      <CardFooter paddingTop="0.4em">
        <HStack color={theme.colors.accent.tertiary} gap="1em">
          <Text className={styles.button}>Edit</Text>
          <span>|</span>
          <Text
            className={styles.button}
            onClick={handleDelete}
            _hover={{ cursor: "pointer" }}
          >
            Remove
          </Text>
          <span>|</span>
          <Text className={styles.button} _hover={{ cursor: "pointer"}} onClick={handleDefault}>Set as default</Text>
        </HStack>
      </CardFooter>
    </Card>
  );
}
