"use client";

import {
  Button,
  Card,
  CardHeader,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function Page() {
  const googleUrl =
    "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA";
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Stack
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
        margin: "1em",
      }}
    >
      <Stack alignItems="center">
        <Heading as="h3">Sign In</Heading>
        <Text as="h5">Select a method of sign in</Text>
      </Stack>
      <Stack maxW="xl" minW="xs" w="100vw">
        <Card marginX="1em" shadow="none">
          <CardHeader>
            <HStack as="a" gap="1em" justifyContent="center">
              <Image src={googleUrl} h="30px" w="auto" />
              <Button onClick={handleGoogleSignIn} className="primary-button">Sign in with Google</Button>
            </HStack>
          </CardHeader>
        </Card>
      </Stack>
    </Stack>
  );
}
