"use client";
import AddressCard from "@/components/address/address-card";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import styles from "./address-page.module.css";
import { useAddressState } from "@/zustand/store";
import { PlusOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";

export default function AddressesPage(): JSX.Element {
  const addresses = useAddressState((state) => state.addresses);
  const isLoading = useAddressState((state) => state.isLoading);
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return <></>;
  }

  return (
    <Box w="full" display="flex" justifyContent="center">
      <Box marginTop="20px">
        <Stack gap="1em">
          <Box>
            <Breadcrumb separator=">">
              <BreadcrumbItem>
                <BreadcrumbLink href="/user/account">
                  Your Account
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage={true}>
                <BreadcrumbLink>Addresses</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>

          <Stack w="fit-content">
            <Heading as="h2">Your Addresses</Heading>
            <Link href="/user/addresses/add">
              <Button
                className="primary-button"
                w="200px"
                bgColor={`${theme.colors.accent.primary} !important`}
              >
                <PlusOutlined style={{ marginRight: "0.4em" }} />
                Add Address
              </Button>
            </Link>
          </Stack>

          <Grid className={styles.grid} gap="1em" marginBottom="1em">
            {addresses.length ? (
              addresses.map((address, index: number) => (
                <GridItem key={index}>
                  <AddressCard {...address} />
                </GridItem>
              ))
            ) : (
              <Box>
                <Heading as="h4">No addresses</Heading>
              </Box>
            )}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
