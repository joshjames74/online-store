"use client"
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import Link from "next/link";
import { useAddressState, useUserState } from "@/zustand/store";
import { ThemeContext } from "@/contexts/theme-context";
import { useDebounce } from "use-debounce";
import AddressCard from "./address-card";


export default function DeliveryButtonLoggedIn(): JSX.Element {
  const { theme } = useContext(ThemeContext);

  const defaultAddress = useUserState((state) => state.defaultAddress);
  const updateDefaultAddress = useUserState(
    (state) => state.updateDefaultAddress,
  );

  const user = useUserState((state) => state.user);

  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoadingDefaultAddress, setIsLoadingDefaultAddress] =
    useState<boolean>(false);

  const [debouncedId] = useDebounce(user.id, 500);

  const isLoading = useAddressState((state) => state.isLoading);
  const getAddresses = useAddressState((state) => state.getAddresses);
  const addresses = useAddressState((state) => state.addresses);

  const onClick = () => {
    setIsOpen(false);
    if (!selectedAddress) {
      return;
    }
    setIsLoadingDefaultAddress(true);
    updateDefaultAddress(selectedAddress)
      .then(() => getAddresses())
      .finally(() => setIsLoadingDefaultAddress(false));
  };

  // useEffect(() => {
  //   if (!user.id) return;
  //   setUserId(user.id);
  //   getAddresses();
  // }, [user.id]);

  const isSelected = (addressId: string): boolean => {
    if (!selectedAddress && addressId === defaultAddress.id) {
      return true;
    }
    if (addressId === selectedAddress) {
      return true;
    }
    return false;
  };

  if (isLoading || isLoadingDefaultAddress) {
    return (
      <Button className="secondary-button">
        <Spinner />
      </Button>
    );
  }

  if (!addresses.length) {
    return (
      <Link href="/user/addresses/add">
        <Button className="secondary-button">Create address</Button>
      </Link>
    );
  }

  return (
    <Box display="flex" flexGrow={"1"}>
      <Button
        className="secondary-button noOfLines-1"
        onClick={() => setIsOpen(true)}
        fontSize="sm"
        gap="1em"
        display="block !important"
        w="max-content"
        maxW="20vw"
      >
        <EnvironmentOutlined style={{ marginRight: "0.5em" }}/>
          {defaultAddress && defaultAddress.id && !defaultAddress.isDeleted 
          ? `${defaultAddress.country.name} ${defaultAddress.area_code}`
          : `Set default address`
        }
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent minH="400px">
          <ModalHeader>Addresses</ModalHeader>
          <ModalBody maxH="70vh" overflowY="scroll">
            <Stack>
              {addresses.map((address, index: number) => {
                return (
                  <Box onClick={() => setSelectedAddress(address.id)} key={index}>
                    <AddressCard
                      params={{
                        address: address,
                        isSelected: isSelected(address.id),
                      }}
                    />
                    <Input
                      key={index}
                      type="hidden"
                      value={address.id.toString()}
                    />
                  </Box>
                );
              })}
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Stack>
              <Link href="/user/addresses" onClick={() => setIsOpen(false)}>
                <Heading as="h4" className="muted-heading" paddingBottom="0">
                  Manage Addresses
                </Heading>
              </Link>
              <HStack>
                <Button onClick={() => setIsOpen(false)} bgColor={`${theme.colors.background.secondary} !important`} className="primary-button">Close</Button>
                <Button onClick={onClick} bgColor={`${theme.colors.accent.primary} !important`} className="primary-button">
                  Set as default
                </Button>
              </HStack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
