"use client";
import AccountPage from "@/components/account/account-page";
import { UserContext } from "@/contexts/user-context";
import { Box } from "@chakra-ui/react";
import { useContext } from "react";

export default function Page(): JSX.Element {
  const { user, isAuthenticated, isLoading } = useContext(UserContext);

  // create loading skeleton
  if (isLoading) return <></>;

  // to do: redirect to 404 page
  if (!isAuthenticated) return <Box>404 not found</Box>;

  // redirect this
  if (!user) return <Box>User not found</Box>;

  return <AccountPage />;
}
