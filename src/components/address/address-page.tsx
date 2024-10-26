"use client";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import AddAddressCard from "@/components/address/add-address-card";
import AddressCard from "@/components/address/address-card";
import { ThemeContext } from "@/contexts/theme-context";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
import { Address } from "@prisma/client";
import { useContext, useEffect, useState } from "react";


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

    return (

        isLoading ? (<Box>Loading....</Box>) : (

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

                        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="1em">
                            <GridItem>
                                <AddAddressCard />
                            </GridItem>
                            {addresses.length ? addresses.map(address => (
                                <GridItem>
                                    <AddressCard {...address} />
                                </GridItem>
                            )) : <></>}
                        </Grid>

                    </Stack>
                </Box>
                
            </Box>

        )

    )

}