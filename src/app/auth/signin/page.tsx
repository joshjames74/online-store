"use client";

import {
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
  const githubUrl =
    "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";

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
        <Heading>Sign In</Heading>
        <Text>Select a method of sign in</Text>
      </Stack>
      <Stack maxW="xl" minW="xs" w="100vw">
        <Card>
          <CardHeader>
            <HStack>
              <Image src={googleUrl} h="50px" w="auto" />
              <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            </HStack>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <HStack>
              <Image src={githubUrl} h="50px" w="auto" />
              <button>Sign in with Google</button>
            </HStack>
          </CardHeader>
        </Card>
      </Stack>
    </Stack>
  );
}
