import { ThemeContext } from "@/contexts/theme-context";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import styles from "./address-card.module.css";
import {
  deleteAddressById,
} from "@/api/request/addressRequest";
import { useUserState } from "@/zustand/store";
import { AddressWithCountry } from "@/api/services/addressService";


export default function AddressCard(
  address: AddressWithCountry,
): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const toast = useToast();

  const updateDefaultAddress = useUserState(
    (state) => state.updateDefaultAddress,
  );

  const handleDelete = () => {
    const pendingToast = toast({
      title: "Deleting address...",
      status: "loading",
    });
    deleteAddressById(address.id)
      .then((res) => {
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
    const pendingToast = toast({
      title: "Setting as default...",
      status: "loading",
    });
    updateDefaultAddress(address.id)
      .then(() => {
        toast.update(pendingToast, {
          title: "Successfully set as default",
          status: "success",
          duration: 1000,
        });
      })
      .catch((error) => {
        toast.update(pendingToast, {
          title: "Error setting as default",
          status: "error",
          duration: 5000,
        });
      })
      .finally(() => {
        location.reload();
      });
  };

  return (
    <Card w="300px" h="250px" borderRadius="1em">
      <CardBody paddingBottom={0}>
        <Stack gap="0.1em">
          <HStack>
            <Avatar src={address.country.image_url} name={address.country.name} aria-label="country-avatar"/>
            <Heading fontSize="md" noOfLines={2}>
              {address.name}
              {address.isDefault ? "[DEFAULT]" : ""}
            </Heading>
          </HStack>
          <Text noOfLines={3}>{address.address_line_1}</Text>
          <Text noOfLines={2}>{address.address_line_2}</Text>
          <Text noOfLines={1}>{address.area_code}</Text>
        </Stack>
      </CardBody>

      <CardFooter paddingTop="0.4em">
        <HStack color={theme.colors.accent.tertiary} gap="1em">
          <Text
            className={styles.button}
            onClick={handleDelete}
            _hover={{ cursor: "pointer" }}
          >
            Remove
          </Text>
          <span>|</span>
          <Text
            className={styles.button}
            _hover={{ cursor: "pointer" }}
            onClick={handleDefault}
          >
            Set default
          </Text>
          <Box>
            {address.isDefault 
            ? 
            <Tag 
              bgColor={theme.colors.accent.primary}
              borderRadius="full"
              paddingX="1em">
                Default
            </Tag>
            : <></> }
          </Box>
        </HStack>
      </CardFooter>
    </Card>
  );
}
