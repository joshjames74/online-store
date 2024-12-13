import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import styles from "./index.module.css";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import { ResultType } from "@/api/helpers/types";
import Link from "next/link";
import { useUserState } from "@/zustand/store";
import { ThemeContext } from "@/contexts/theme-context";


export default function DeliveryButtonLoggedIn(): JSX.Element {

  const { theme } = useContext(ThemeContext);

  const defaultAddress = useUserState((state) => state.defaultAddress);
  const updateDefaultAddress = useUserState((state) => state.updateDefaultAddress);

  const user = useUserState((state) => state.user);

  const [addresses, setAddresses] = useState<
    ResultType<"address", { country: true }>[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    setIsLoading(true);
    getAddressesByUserId(user.id)
      .then((addresses) => setAddresses(addresses))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const onClick = () => {
    setIsOpen(false);
    if (!selectedAddress) { return }
    setIsLoading(true);
    updateDefaultAddress(selectedAddress).finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <Button className={styles.text_button}>
        <Spinner />
      </Button>
    );
  }

  if (!isLoading && !addresses.length) {
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
          {defaultAddress && defaultAddress.id ? (
            <>
              <Text fontWeight="normal" className={styles.text_wrap}>
              Deliver to {defaultAddress.address_line_1}
              </Text>
              <Text fontWeight="semibold" className={styles.text_wrap}>
                {defaultAddress?.country?.name} {defaultAddress.area_code}
              </Text>
            </>
          ) : 
          <Text fontWeight="semibold" fontSize="sm" className={styles.text_wrap}>
            Set default address
          </Text>}
        </Box>
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Addresses</ModalHeader>
          <ModalBody>
            <RadioGroup 
            defaultValue={defaultAddress?.id?.toString()}
            onChange={(value) => setSelectedAddress(parseInt(value))}>
              <Stack>
                {addresses.map((address, index: number) => {
                  return (
                    <Radio key={index} value={address.id.toString()}>
                      <Text noOfLines={1} textOverflow="ellipsis" >
                        {address.name}, {address.address_line_1}, {address.area_code}, {address.country.name}
                      </Text>
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
            <Button onClick={onClick} bgColor={theme.colors.accent.primary}>Set as default</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
