"use client";
import { getAllCountries } from "@/api/request/countryRequest";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, FormLabel, Heading, Stack, Input, InputGroup, Select, Button, useToast, HStack } from "@chakra-ui/react";
import { Address, Country } from "@prisma/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./address-form.module.css";
import { UserContext } from "@/contexts/user-context";
import SignInRequiredPage from "../auth/sign-in-required-page";
import { postAddress } from "@/api/request/addressRequest";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/contexts/theme-context";


export default function AddressForm(): JSX.Element {

    const { register, handleSubmit, formState: { errors }} = useForm();
    const { user, isAuthenticated } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const toast = useToast();

    const handleSuccess = () => { toast({ title: "Address saved successfully", status: "success", duration: 1000}) }
    const handleError = () => { toast({ title: "Error saving address", status: "error", duration: 5000 });}

    useEffect(() => {
        setIsLoading(true);
        getAllCountries().then(countries => {
            setCountries(countries);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    const onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const address = Object.fromEntries(formData)

        postAddress(address).then(res => {
            handleSuccess();
            router.push('/user/addresses')
        }).catch(error => {
            handleError();
            console.log(error);
        })
    }

    if (!isAuthenticated || !user || !user.id) { return <SignInRequiredPage props={{message: "add address"}}/> }

    return (

        <Box w="full" display="flex" justifyContent="center" marginTop="1em">


            <Stack w="600px" gap="1em">

                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/account">Your account</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/addresses">Your addresses</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink isCurrentPage={true}>New address</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>


                <Heading>Add a new address</Heading>

                <form className={styles.form} onSubmit={(event) => handleSubmit(onSubmit(event))}>

                        <Stack gap="1em">

                        <Stack>
                            <label>Country</label>
                            <Select id="country" placeholder="Select country" maxH="100px"
                                {...register('countryId', { required: 'Country is required'})}>
                                {countries.length ? countries.map((country: Country, index: number) => {
                                    return <option  key={index} value={country.id}>{country.name}</option>
                                }) : <></>}
                            </Select>
                        </Stack>

                        <Stack>
                            <label htmlFor="name">Address name</label>
                            <input id="name" type="text" {...register('name', { required: 'Name is required' })} />
                            {errors.name && <p>{errors.name.message}</p>}
                        </Stack>

                        <Stack>
                            <label htmlFor="name">Address number</label>
                            <input id="number" type="text" {...register('number', { required: 'Number is required'})} /> 
                            {errors.number && <p>{errors.number.message}</p>}
                        </Stack>

                        <Stack>
                            <label htmlFor="street">Street</label>
                            <input id="street" type="text" {...register('street', { required: 'Street is required' })} /> 
                            {errors.street && <p>{errors.street.message}</p>}
                        </Stack>
                        
                        <Stack>
                            <label htmlFor="area_code">Postcode</label>
                            <input id="area_code" type="text" {...register('area_code', { required: 'Postcode is required'})} /> 
                            {errors.area_code && <p>{errors.area_code.message}</p>}
                        </Stack>

                        <input type="hidden" name="usrId" value={user.id}/>

                        <Button type="submit" w="fit-content" bgColor={theme.colors.accent.primary}>Add address</Button>
                        
                        </Stack>
                </form>

            </Stack>

        </Box>
    )

}