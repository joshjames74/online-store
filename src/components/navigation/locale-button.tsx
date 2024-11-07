import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { DownOutlined } from "@ant-design/icons";
import { Button, Heading, HStack, Image,  Popover, PopoverBody, PopoverContent, PopoverTrigger, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";


export default function LocaleButton({ props }: { props: { user: UserWithCurrencyAndCountry }}): JSX.Element {

    const { user } = props;

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                display="flex"
                alignContent="center"
                gap="0.4em"
                paddingX="1em"
                minW="fit-content">
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