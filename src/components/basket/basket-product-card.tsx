import { ThemeContext } from "@/contexts/theme-context";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Box, Button, Card, CardBody, Checkbox, Grid, GridItem, Heading, HStack, Image, SliderFilledTrack, Stack, Text } from "@chakra-ui/react";
import { BasketItem } from "@prisma/client";
import { useContext, useState } from "react";

export default function BasketProductCard({...basketItem}: BasketItem): JSX.Element {

    const { theme } = useContext(ThemeContext);

    const maxQuantity = 30;
    const [quantity, setQuantity] = useState<number>(basketItem.quantity);
    const [isSelected, setIsSelected] = useState<boolean>(true);

    const handleIncrementQuantity = () => setQuantity(Math.min(quantity + 1, maxQuantity));
    const handleDecrementQuantity = () => setQuantity(Math.max(quantity - 1, 0));

    return (
        <HStack>

            <Box>
                <Checkbox isChecked={isSelected}/>
            </Box>

            <Image h="150px" objectFit="cover" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"/>

            <Grid templateColumns="3fr 1fr" templateRows="3fr 1fr" w="100%">

                <GridItem colStart={1} colEnd={1}>
                    <HStack>
                        <Heading>{basketItem.quantity.toString()}</Heading>
                    </HStack>
                </GridItem>

                <GridItem colStart={2} rowStart={1}>
                    <Text marginLeft="auto" marginRight={0} maxW="fit-content" overflow="nowrap">£74.50</Text>
                </GridItem>

                <GridItem colStart={1} rowStart={2}>
                    <HStack>
                        <HStack as={Button} gap={5}>
                            <MinusOutlined onClick={handleDecrementQuantity}/>
                            <Text>{quantity}</Text>
                            <PlusOutlined onClick={handleIncrementQuantity} />
                        </HStack>
                        <Text _hover={{ color:  theme.colors.text.focus, textDecoration: 'underline' }}>Delete</Text>
                    </HStack>
                </GridItem>

            </Grid>

        </HStack>
    )

}