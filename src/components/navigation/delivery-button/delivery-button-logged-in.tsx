import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import styles from "./index.module.css";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
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
  const setUserId = useAddressState((state) => state.setUserId);

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

  useEffect(() => {
    if (!user.id) return;
    setUserId(user.id);
    getAddresses();
  }, [user.id]);

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
      <Button className={styles.text_button}>
        <Spinner />
      </Button>
    );
  }

  if (!addresses.length) {
    return (
      <Link href="/user/addresses/add">
        <Button className={styles.text_button}>Create address</Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        className={styles.container}
        onClick={() => setIsOpen(true)}
        bgColor="transparent"
        fontSize="2xl"
      >
        <EnvironmentOutlined />
        <Box className={styles.text_container} fontSize="xs" overflow="hidden">
          {defaultAddress && defaultAddress.id && !defaultAddress.isDeleted ? (
            <>
              <Text fontWeight="normal" className={styles.text_wrap}>
                Deliver to {defaultAddress.address_line_1}
              </Text>
              <Text fontWeight="semibold" className={styles.text_wrap}>
                {defaultAddress?.country?.name} {defaultAddress.area_code}
              </Text>
            </>
          ) : (
            <Text
              fontWeight="semibold"
              fontSize="sm"
              className={styles.text_wrap}
            >
              Set default address
            </Text>
          )}
        </Box>
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
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
            <Link href="/user/addresses" onClick={() => setIsOpen(false)}>
              Manage Addresses
            </Link>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
            <Button onClick={onClick} bgColor={theme.colors.accent.primary}>
              Set as default
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
