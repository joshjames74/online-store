"use client";
import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";

export default function AccountButton(): JSX.Element {

    const { user, isAuthenticated, isLoading } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    if (isAuthenticated) {
        return (
        <Link href={`/user/${user?.id}/account`}>
            <Button gap="1em">
                <Text>Account</Text>
                <Image h="30px" w="30px" borderRadius="100%" src={user?.image_url || ''}/>
            </Button>
        </Link>)
    }
    
    if (isLoading) return (<Link href="/"><Button>Loading...</Button></Link>)

    return (<Link href="/auth/signin"><Button>Sign in</Button></Link>)

}
