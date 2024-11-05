"use client";
import { UserContext } from "@/contexts/user-context";
import { DownOutlined } from "@ant-design/icons";
import { Button, Heading, HStack, Image,  Popover, PopoverBody, PopoverContent, PopoverTrigger, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useContext } from "react";

export default function CurrencyCountryButton(): JSX.Element {

    const { user, isAuthenticated } = useContext(UserContext)

    if (!isAuthenticated || !user) {
        return <></>
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                display="flex"
                alignContent="center"
                gap="0.4em"
                w="fit-content">
                    <Image 
                    h="full"
                    w="auto"
                    objectFit="cover"
                    src={user.country ? user.country.image_url : 'https://flagsapi.com/GB/flat/64.png'} />
                    <DownOutlined />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Stack>

                        <Heading fontSize="md">Currency</Heading>
                        <HStack justifyContent="space-between">
                            <Text>{user.currency ? `${user.currency.symbol} - ${user.currency.code}` : '£ - GBP'}</Text>
                            <Link href={`/user/preferences/currency?redirectUrl=${location.pathname}`}>
                                <Text textDecoration="underline">Change currency</Text>
                            </Link>
                        </HStack>

                        <Heading fontSize="md">Country</Heading>
                        <HStack justifyContent="space-between">
                            <Text>{user.country ? `${user.country.code} - ${user.country.name}` : 'GB - United Kingdom'}</Text>
                            <Link href={`/user/preferences/country?redirectUrl=${location.pathname}`}>
                                <Text textDecoration="underline">Change country</Text>
                            </Link>
                        </HStack>

                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )

}