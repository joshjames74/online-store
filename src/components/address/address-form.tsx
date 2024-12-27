"use client";
import { getAllCountries } from "@/api/request/countryRequest";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Stack,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Country } from "@prisma/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./address-form.module.css";
import { postAddress } from "@/api/request/addressRequest";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/contexts/theme-context";
import { useAddressState, useUserState } from "@/zustand/store";

export default function AddressForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { theme } = useContext(ThemeContext);
  const user = useUserState((state) => state.user);

  const getAddresses = useAddressState((state) => state.getAddresses);

  const router = useRouter();
  const toast = useToast();

  const [countries, setCountries] = useState<Country[]>([]);

  // fetch countries
  useEffect(() => {
    getAllCountries()
      .then((countries) => setCountries(countries))
      .catch((error) => console.error(error));
  }, []);

  // post address or fail
  const onSubmit = (event: FormEvent<any>) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const address = Object.fromEntries(formData);

    const pendingToast = toast({
      title: "Saving address...",
      status: "loading",
    });

    postAddress(address)
      .then((res) => {
        // display success
        toast.update(pendingToast, {
          title: "Address saved successfully",
          status: "success",
          duration: 1000,
        });
        router.push("/user/addresses");
      })
      .catch((error) => {
        toast.update(pendingToast, {
          title: "Error saving address",
          status: "error",
          duration: 5000,
        });
        console.error(error);
      })
      .finally(() => getAddresses());
  };

  // handler function to pass event into onSubmit
  const handleFormSubmit = (event: FormEvent<any>) => {
    event.preventDefault();
    handleSubmit(() => onSubmit(event))();
  };

  const errorMessage = (message: string | undefined) => {
    return <p className={styles.error_message}>{message || ""}</p>;
  };

  return (
    <Box
      minW={theme.sizes.minWidth}
      w="full"
      display="flex"
      justifyContent="center"
      marginY="1em"
      padding="1em"
    >
      <Stack w="600px" gap="1em">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/account">Your account</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/addresses">
              Your addresses
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage={true}>New address</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading>Add a new address</Heading>

        <form
          className={styles.form}
          onSubmit={(event) => handleFormSubmit(event)}
        >
          <Stack gap="1em" minW="max-content" maxW="md">
            <Stack>
              <label>Country</label>
              <Select
                id="country"
                placeholder="Select country"
                maxH="100px"
                {...register("countryId", { required: "Country is required" })}
              >
                {countries.length ? (
                  countries.map((country: Country, index: number) => {
                    return (
                      <option key={index} value={country.id}>
                        {country.name}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
              </Select>
              {errors.countryId &&
                errorMessage(errors.countryId.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="name">Address name</label>
              <input
                className="primary-border"
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && errorMessage(errors.name.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="name">Address line 1</label>
              <input
                className="primary-border"
                id="number"
                type="text"
                {...register("address_line_1", {
                  required: "Address line 1 is required",
                })}
              />
              {errors.number && errorMessage(errors.number.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="street">Address line 2</label>
              <input
                id="street"
                type="text"
                className="primary-border"
                {...register("address_line_2", {
                  required: "Address line 2 is required",
                })}
              />
              {errors.street && errorMessage(errors.street.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="area_code">Postcode</label>
              <input
                className="primary-border"
                id="area_code"
                type="text"
                {...register("area_code", { required: "Postcode is required" })}
              />
              {errors.area_code &&
                errorMessage(errors.area_code.message?.toString())}
            </Stack>
            <input type="hidden" name="usrId" value={user.id} />
            <Button
              type="submit"
              w="fit-content"
              className="primary-button"
              bgColor={`${theme.colors.accent.primary} !important`}
            >
              Add address
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
