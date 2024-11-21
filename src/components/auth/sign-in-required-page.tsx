import { Box, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function SignInRequiredPage({
  props,
}: {
  props: { message: string };
}): JSX.Element {
  return (
    <Stack w="full" marginY="2em" alignItems="center">
      <Text>Sign in required to {props.message}</Text>
      <Link href="/auth/signin">
        <Text>Click here to sign in</Text>
      </Link>
    </Stack>
  );
}
