"use client";
import AddressesPage from "@/components/address/address-page";
import { UserContext } from "@/contexts/user-context";
import { Box } from "@chakra-ui/react";
import { useContext } from "react";

export default function Page(): JSX.Element {
  const { user, isAuthenticated, isLoading } = useContext(UserContext);

  // create loading skeleton
  if (isLoading) return <Box>Loading... </Box>;

  // to do: redirect to 404 page
  if (!isLoading && !isAuthenticated) return <Box>404 not found</Box>;

  // redirect this
  if (!user || !user.id) return <Box>User not found</Box>;

  return <AddressesPage params={{ id: user.id }} />;
}
