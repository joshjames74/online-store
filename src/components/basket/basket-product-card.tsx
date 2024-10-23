import { deleteBasketItemById, putBasketItemQuantityById } from "@/api/request/basketRequest";
import { BasketItemWithProduct } from "@/api/services/basketItemService";
import { ThemeContext } from "@/contexts/theme-context";
import { useBasketStore } from "@/zustand/store";
import { CheckCircleFilled, CheckCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Box, Button, Card, CardBody, Checkbox, CircularProgress, Grid, GridItem, Heading, HStack, Image, SliderFilledTrack, Stack, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";


export default function BasketProductCard({ basketItem }: { basketItem: BasketItemWithProduct }): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const loadData = useBasketStore((state) => state.loadData);

    // set vars relating to displaying success, error, and loading
    const [isLoadingQuantity, setIsLoadingQuantity] = useState<boolean>(false);
    const [showStatus, setShowStatus] = useState<boolean>(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // increment product quantity
    const handleIncrementQuantity = () => updateQuantity(1)
    const handleDecrementQuantity = () => updateQuantity(-1);

    const updateQuantity = async (quantity: number) => {
        setIsLoadingQuantity(true);
        try {
            await putBasketItemQuantityById(basketItem.id, Math.max(basketItem.quantity + quantity, 0))
        }
        catch (error) {
            console.log(error);
        }
        finally {
            loadData(parseInt(basketItem?.usrId?.toString() || '')).then(res => {
                setIsLoadingQuantity(false)
                handleStatus();
            });
        }
    }

    const handleStatus = () => {
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 1000);
    }

    const handleDelete = async () => {
        setIsLoadingDelete(true);
        deleteBasketItemById(basketItem.id).then(res => {
            loadData(parseInt(basketItem?.usrId?.toString() || ''))
            setIsLoadingDelete(false);
        })
    }


    return (
        <HStack gap="0.4em" padding="0.4em" minW="500px" maxH="100px" alignItems="stretch">

            <Image h="100px" w="auto" objectFit="cover" borderRadius="md" src="https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg" />

            <Grid templateColumns="3fr 1fr" templateRows="3fr 1fr" w="100%" >

                <GridItem colStart={1} colEnd={1} maxH="fit-content">
                    <Stack>
                        <Heading fontSize="lg">{basketItem.product.title}</Heading>
                        <Text noOfLines={1} textOverflow="ellipsis">{basketItem.product.description}</Text>
                    </Stack>
                </GridItem>

                <GridItem colStart={2} rowStart={1}>
                    <Heading
                        marginLeft="auto"
                        marginRight={0}
                        maxW="fit-content"
                        overflow="nowrap"
                        fontSize="lg"
                        color={theme.colors.accent.tertiary}>
                        £{Math.round(basketItem.product.price * basketItem.quantity * 100) / 100}
                    </Heading>
                </GridItem>

                <GridItem colStart={1} rowStart={2}>
                    <HStack>
                        <HStack as={Button} gap={5} h="fit-content" padding="0.4em">
                            <MinusOutlined onClick={handleDecrementQuantity} />
                            {isLoadingQuantity 
                            ? <CircularProgress isIndeterminate size="1em" />
                            : showStatus 
                                ? <Box color={theme.colors.semantic.success}><CheckCircleFilled /></Box> 
                                : <Text>{basketItem.quantity}</Text>}
                            <PlusOutlined onClick={handleIncrementQuantity} />
                        </HStack>
                        <Text 
                            _hover={{ color: theme.colors.text.focus, textDecoration: 'underline', cursor: "pointer" }}
                            onClick={handleDelete}>
                                Delete {isLoadingDelete ? <CircularProgress size="1em" isIndeterminate /> : <></>}
                        </Text>
                    </HStack>
                </GridItem>

            </Grid>

        </HStack>
    )

}