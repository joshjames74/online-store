"use client";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import AddAddressCard from "@/components/address/add-address-card";
import AddressCard from "@/components/address/address-card";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { Address } from "@prisma/client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "./address-page.module.css";
import { useUserState } from "@/zustand/store";

export default function AddressesPage(): JSX.Element {
  const user = useUserState((state) => state.user);
  const id = user.id;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getAddressesByUserId(id)
      .then((res) => {
        setAddresses(res);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

          <Heading>Your Addresses</Heading>

          <Grid className={styles.grid} gap="1em" marginBottom="1em">
            <GridItem>
              <Link href="/user/addresses/add">
                <AddAddressCard />
              </Link>
            </GridItem>
            {addresses.length ? (
              addresses.map((address, index: number) => (
                <GridItem key={index}>
                  <AddressCard {...address} />
                </GridItem>
              ))
            ) : (
              <></>
            )}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
