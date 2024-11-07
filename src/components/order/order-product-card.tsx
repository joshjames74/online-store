"use client"
import { ResultType } from "@/api/helpers/types";
import { SettingsContext } from "@/contexts/settings-context";
import { Box, Card, CardBody, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";
import { useContext } from "react";

export default function OrderProductCard(product: ResultType<'product', { currency: true }>): JSX.Element {

    const { defaultImageUrl } = useContext(SettingsContext);

    return (
        <Box minW="fit-content">
            <HStack alignItems="stretch">
                <Image h="70px" w="auto" src={defaultImageUrl}/>
                <Stack>
                    <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">{product.title}</Heading>
                </Stack>
            </HStack>
        </Box>

    )

}