import { Button, Stack, Text } from "@chakra-ui/react";
import styles from "./index.module.css";

export default function DeliveryButtonLoggedOut(): JSX.Element {
  return (
    <Button className={styles.text_button} maxW="100px">
      <Stack fontSize="xs" gap={0} textAlign="left">
        <Text>Sign in to</Text>
        <Text>set an address</Text>
      </Stack>
    </Button>
  );
}
