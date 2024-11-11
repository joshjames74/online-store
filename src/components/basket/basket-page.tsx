import { ThemeContext } from "@/contexts/theme-context"
import { Box, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import BasketProductCard from "./basket-product-card";
import { Basket } from "@/api/services/basketItemService";
import { UserContext } from "@/contexts/user-context";
import { deleteBasketById, getBasketByUserId, getBasketItemsByUserId } from "@/api/request/basketRequest";
import { getProductPrice } from "@/api/helpers/utils";
import styles from "./basket-page.module.css";


export default function BasketPage(): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const [basket, setBasket] = useState<Basket>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadData = async (cache?: RequestCache) => {
        if (!user || !user.id) { return }
        getBasketByUserId(user.id, cache ? cache : "force-cache").then(res => {
            setBasket(res)
        }).catch(error => {
            console.error(error);
        })
    }

    useEffect(() => {
        setIsLoading(true);
        loadData();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        setIsLoading(true);
        loadData();
        setIsLoading(false);
    }, [user])


    const handleDelete = () => {
        setIsLoading(true);
        deleteBasketById(user.id).then(res => {
            // reload basket call
            getBasketByUserId(user.id, "reload").then(() => {}).catch(error => console.error(error));
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    if (!user || !user.id) {
        return <Box>User not found</Box>
    } 

    if (isLoading) {
        return <Box>Loading</Box>
    }

    if (!basket || !basket.items.length) {
        return (
            <Card minW={theme.sizes.minWidth} className={styles.container} marginY="20px" flexGrow={1}>
                <CardHeader>
                    <Heading fontSize="3xl" fontWeight="semibold">Basket is empty</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Link href="/">
                        <Text>Click here to shop for products</Text>
                    </Link>
                </CardBody>
            </Card>
        )
    }


    return (
        <Card minW={theme.sizes.minWidth} className={styles.container} marginY="20px">

            <CardHeader paddingBottom={0}>
                <Heading fontWeight="semibold" fontSize="3xl">Shopping Basket {isLoading ? <CircularProgress size="1em" isIndeterminate /> : <></>}</Heading>
                <Text color={theme.colors.accent.tertiary} cursor="pointer" _hover={{ textDecoration: "underline" }} onClick={handleDelete}>Clear basket</Text>
            </CardHeader>

            <CardBody paddingBottom={0}>
                <Stack>
                    {basket.items && basket.items.map((basketItem, index: number) => <BasketProductCard key={index} basketItem={basketItem} loadData={loadData} />)}
                </Stack>
            </CardBody> 

            <CardFooter marginRight={0} marginLeft="auto">
                <Heading fontWeight="semibold" fontSize="xl">
                    Subtotal ({basket.metadata && basket.metadata.total.quantity} items): 
                    <b> {basket.metadata && getProductPrice(basket.metadata.total.price, 1, user)}</b>
                </Heading>
            </CardFooter>

        </Card>
    )
}
