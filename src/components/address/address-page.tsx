"use client";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import AddAddressCard from "@/components/address/add-address-card";
import AddressCard from "@/components/address/address-card";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
import { Address } from "@prisma/client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "./address-page.module.css";


export default function AddressesPage({ params }: { params: { id: number } }): JSX.Element {

    const { id } = params;
    const { theme } = useContext(ThemeContext);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getAddressesByUserId(id).then(res => {
            setAddresses(res);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) { return <></> }

    return (
        <Box w="full" display="flex" justifyContent="center">

            <Box marginTop="20px">
                <Stack gap="1em">
                    <Box>
                        <Breadcrumb separator=">">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/user/account">Your Account</BreadcrumbLink>
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
                        {addresses.length ? addresses.map((address, index: number) => (
                            <GridItem key={index}>
                                <AddressCard {...address} />
                            </GridItem>
                        )) : <></>}
                    </Grid>
                </Stack>
            </Box>
        </Box>
    )
}