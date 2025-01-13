import { Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function DeliveryButtonLoggedOut(): JSX.Element {
  return (
    <Link href="/auth/signin">
      <Button className="secondary-button" maxW="100px">
        <Stack gap={0} textAlign="left">
          <Text as="h6" fontFamily="inherit" color="inherit">
            Sign in to
          </Text>
          <Text as="h6" fontFamily="inherit" color="inherit">
            set an address
          </Text>
        </Stack>
      </Button>
    </Link>
  );
}
