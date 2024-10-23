import { Box, Card, CardBody, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { Product } from "@prisma/client";

export default function OrderProductCard(product: Product): JSX.Element {

    return (


        <Box minW="fit-content">
            <HStack alignItems="stretch">
                <Image h="70px" w="auto" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"/>
                <Stack>
                    <Heading textOverflow="ellipsis" noOfLines={2} fontSize="md">{product.title}</Heading>
                    <Heading fontSize="sm" fontWeight="semibold">Seller name</Heading>
                </Stack>
            </HStack>
        </Box>

    )

}