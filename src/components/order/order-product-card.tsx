import { ResultType } from "@/api/helpers/types";
import { Box, Card, CardBody, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";

export default function OrderProductCard(product: ResultType<'product', { currency: true }>): JSX.Element {

    return (
        <Box minW="fit-content">
            <HStack alignItems="stretch">
                <Image h="70px" w="auto" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"/>
                <Stack>
                    <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">{product.title}</Heading>
                </Stack>
            </HStack>
        </Box>

    )

}