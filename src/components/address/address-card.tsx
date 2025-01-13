import { ThemeContext } from "@/contexts/theme-context";
import {
  Avatar,
  Box,
  Button,
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
import { deleteAddressById } from "@/api/request/addressRequest";
import { useAddressState, useUserState } from "@/zustand/store";
import { AddressWithCountry } from "@/api/services/addressService";

export default function AddressCard(address: AddressWithCountry): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const toast = useToast();

  const updateDefaultAddress = useUserState(
    (state) => state.updateDefaultAddress,
  );
  const getDefaultAddress = useUserState((state) => state.getDefaultAddress);
  const getAddresses = useAddressState((state) => state.getAddresses);

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
      })
      .catch((error) => {
        console.error(error);
        toast.update(pendingToast, {
          title: "Error deleting address",
          status: "error",
          duration: 5000,
        });
      })
      .finally(() => {
        getDefaultAddress().then(() => getAddresses());
      });
  };

  const handleDefault = () => {
    const pendingToast = toast({
      title: "Setting as default...",
      status: "loading",
      isClosable: true,
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
      .finally(() => getAddresses());
  };

  return (
    <Card w="300px" h="250px" borderRadius="1em" shadow="none">
      <CardBody paddingBottom={0}>
        <Stack gap="0.1em">
          <HStack>
            <Avatar
              src={address.country.image_url}
              name={address.country.name}
              aria-label="country-avatar"
            />
            <Heading className="noOfLines-2" as="h4">
              {address.name}
            </Heading>
          </HStack>
          <Text as="h5" className="noOfLines-3">
            {address.address_line_1}
          </Text>
          <Text as="h5" className="noOfLines-2">
            {address.address_line_2}
          </Text>
          <Text as="h5" className="noOfLines-1">
            {address.area_code}
          </Text>
        </Stack>
      </CardBody>

      <CardFooter paddingTop="0.4em">
        <HStack
          color={theme.colors.accent.tertiary}
          gap="0.4em"
          h="fit-content"
          alignItems="stretch"
        >
          <Button
            className="primary-button"
            color={`${theme.colors.semantic.error} !important`}
            onClick={handleDelete}
          >
            Remove
          </Button>
          <Button
            className="primary-button"
            color={`${theme.colors.accent.primary} !important`}
            onClick={handleDefault}
          >
            Set as default
          </Button>
          <Box>
            {address.isDefault ? (
              <Tag
                bgColor={theme.colors.accent.primary}
                h="100%"
                paddingX="1em"
                borderRadius="1em"
              >
                Default
              </Tag>
            ) : (
              <></>
            )}
          </Box>
        </HStack>
      </CardFooter>
    </Card>
  );
}
