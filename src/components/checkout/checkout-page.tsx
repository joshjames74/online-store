"use client"
import { convertAndFormatToUserCurrency, formatPrice } from "@/api/helpers/utils";
import { getAddressesByUserId } from "@/api/request/addressRequest";
import { getBasketByUserId } from "@/api/request/basketRequest";
import { getOrdersByUserId, getOrderViewById, postOrder } from "@/api/request/orderRequest";
import { Basket } from "@/api/services/basketItemService";
import { getOrderViewsBySearch } from "@/api/services/orderService";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Select, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { Address, Order } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CheckoutPage({ params }: { params: { basket: Basket }}): JSX.Element {

    const { basket } = params; 

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const toast = useToast();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>();
    const [addressId, setAddressId] = useState<number>();

    const onSubmit = (event: FormEvent<any>) => {

        const pendingToast = toast({ title: "Processing order", status: "loading" })

        // get form data
        const element = event.target as HTMLFormElement;
        const data = new FormData(element);
        const formObject: Order = Object.fromEntries(data) as unknown as Order;
        // parse the data
        const order: Omit<Order, "id"> = {} as Order;
        order.addressId = parseInt(formObject.addressId.toString() || "");
        order.currencyId = parseInt(formObject.currencyId.toString() || "");
        order.usrId = parseInt(formObject.usrId.toString() || "");
        order.date = new Date (parseInt(formObject.date.toString() || "")).toISOString() as unknown as Date;

        // post the order
        postOrder({ order })
            .then(res => {
                toast.update(pendingToast, { title: "Order saved successfully", status: "success", duration: 1000 });
                router.push("/user/orders");
                // reload required things
                getBasketByUserId(user.id, "reload")
                    .then(() => {})
                    .catch(error => console.error(error));
                getOrdersByUserId({ id: user.id, params: {} as any, cache: "reload" })
                    .then(() => {})
                    .catch(error => console.error(error));
            })
            .catch(error => {
                console.error(error);
                toast.update(pendingToast, { title: "Error saving order", status: "error", duration: 5000 })
            })
    };
    
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(() => onSubmit(event))();
    };


    // load addresses
    useEffect(() => {
        if (!user || !user.id) { return };
        getAddressesByUserId(user.id)
            .then(res => setAddresses(res))
            .catch(error => console.error(error));
    }, [user]);


    if (!user || !user?.id) {
        return <></>
    }

    return (
        <>

        <Card w="md">
            <CardHeader paddingBottom={0}>
                <Heading fontSize="xl" w="full" textAlign="center">Order Summary</Heading>
            </CardHeader>

            <CardBody w="full">
                <Stack w="full" gap={"1em"}>
                    <HStack justifyContent="space-between">
                        <Heading fontSize="lg">Currency</Heading>
                        {user.currencyId 
                        ? <Text 
                            color={theme.colors.accent.tertiary}
                            fontWeight="bold">{user.currency.code}({user.currency.symbol})</Text> 
                        : <Link href="/user/preferences/currency">
                            <Text color={theme.colors.semantic.error}>
                                Set currency
                            </Text>
                        </Link>}
                    </HStack>

                    <HStack justifyContent="space-between">
                        <Heading fontSize="lg">Address</Heading>
                        {addresses && addresses.length
                        ? 
                            <Stack>
                                <Select 
                                placeholder="Select Address"
                                onChange={(event) => setAddressId(parseInt(event.target.value))}>
                                    {addresses.map(address => (
                                        <option value={address.id}>
                                            {address.address_line_1}
                                            {", "}
                                            {address.area_code}
                                        </option>
                                    ))}
                                </Select>
                            </Stack>
                        : <Link href="/user/addresses/add">
                            <Text color={theme.colors.semantic.error}>
                                Add address
                            </Text>
                        </Link>}
                    </HStack>

                    <HStack justifyContent="space-between">
                        <Heading fontSize="lg">Total</Heading>
                        <Text 
                        fontWeight="bold"
                        color={theme.colors.accent.tertiary}>
                            {convertAndFormatToUserCurrency(basket.metadata.total.price, user)}
                        </Text>
                    </HStack>
                </Stack>
            </CardBody>


            <CardFooter justifyContent="right" paddingTop={0}>

            <form onSubmit={(event) => handleFormSubmit(event)}>
                <input id="usrId" name="usrId" type="hidden" value={user.id} />
                <input id="date" name="date" type="hidden" value={Date.now()} />
                <input id="currencyId" name="currencyId" type="hidden" value={user.currencyId || ""}/>
                <input id="addressId" name="addressId" type="hidden" value={addressId} />

                <Button 
                type="submit"
                isDisabled={!(!!addressId && !!user.currencyId)}
                bgColor={theme.colors.accent.primary}>
                    Checkout
                    <ArrowRightOutlined />
                </Button>
            </form>

            </CardFooter>
            
        </Card>
        </>
    )

}