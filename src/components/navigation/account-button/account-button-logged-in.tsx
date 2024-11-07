import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { Avatar, Button, Popover, PopoverBody, PopoverContent, PopoverTrigger, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import styles from "./index.module.css";

export default function AccountButtonLoggedIn({ props }: { props: { user: UserWithCurrencyAndCountry } }): JSX.Element {

    const { user } = props;

    return (
    <Link href="/user/account">
        <Popover trigger="hover">
            <PopoverTrigger>
                <Button gap="0.4em">
                    <Avatar name={user.name} src={user.image_url || ''} size="sm" objectFit="cover"/>
                    <Text>Account</Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent w="fit-content" padding="0.4em">
                <PopoverBody fontWeight="semibold">
                    <Stack gap="0.4em" className={styles.popover_stack}>
                        <Link href="/user/orders">
                            <Text>Your orders</Text>
                        </Link>
                        <Link href="/user/addresses">
                            <Text>Your addresses</Text>
                        </Link>
                        <Link href="/auth/signout">
                            <Text>Your payments</Text>
                        </Link>
                        <Link href="/user/orders">
                            <Text>Sign out</Text>
                        </Link>
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </Link>
    )
}