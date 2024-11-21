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
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import styles from "./index.module.css";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import { ResultType } from "@/api/helpers/types";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";

export default function DeliveryButtonLoggedIn({
  props,
}: {
  props: { user: UserWithCurrencyAndCountry };
}): JSX.Element {
  const { user } = props;

  const [addresses, setAddresses] = useState<
    ResultType<"address", { country: true }>[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    if (!user || !user.id) {
      return;
    }
    setIsLoading(true);
    getAddressesByUserId(user.id)
      .then((addresses) => {
        setAddresses(addresses);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [user]);

  if (isLoading) {
    return <Button className={styles.text_button}>Loading...</Button>;
  }

  if (!isLoading && !addresses.length) {
    return <Button className={styles.text_button}>Create address</Button>;
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
          <Text fontWeight="normal" className={styles.text_wrap}>
            Deliver To {addresses[0].address_line_1}
          </Text>
          <Text fontWeight="semibold" className={styles.text_wrap}>
            {addresses[0].country.name} {addresses[0].area_code}
          </Text>
        </Box>
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Addresses</ModalHeader>
          <ModalBody>
            <RadioGroup>
              <Stack>
                {addresses.map((address, index: number) => {
                  return (
                    <Radio key={index} value={address.id.toString()}>
                      <Text noOfLines={1} textOverflow="ellipsis">
                        {address.name}
                      </Text>
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
