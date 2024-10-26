import { Box, Grid, Heading, Stack } from "@chakra-ui/react";
import AccountCard, { AccountCardProps } from "./account-card";
import Link from "next/link";

export default function AccountPage({ params }: { params: { id: number }}): JSX.Element {

    const { id } = params;

    const pages: AccountCardProps[] = [
        { 
            title: "Your orders", 
            subtitle: "Track, return, cancel an order, download invoice or buy again",
            href: `/user/${id}/orders`
        },
        { 
            title: "Your addresses", 
            subtitle: "Edit, remove, or set default addresses",
            href: `/user/${id}/addresses`
        }
    ]

    return (

        <Box w="full" display="flex" justifyContent="center" padding="2em">

            <Stack maxW="1200px" w="fit-content" gap="1em">
                <Heading fontWeight="semibold">Your account</Heading>
                <Grid gridTemplateColumns="repeat(5, 1fr)" gap="1em">
                    {pages.map(page => <AccountCard {...page}/>)}
                </Grid>
            </Stack>
        </Box>

    )

}