"use client";
import { getAllCountries } from "@/api/request/countryRequest";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Stack,
  Input,
  InputGroup,
  Select,
  Button,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { Address, Country } from "@prisma/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./address-form.module.css";
import { UserContext } from "@/contexts/user-context";
import SignInRequiredPage from "../auth/sign-in-required-page";
import {
  getAddressesByUserId,
  postAddress,
} from "@/api/request/addressRequest";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/contexts/theme-context";

export default function AddressForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, isAuthenticated } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  // fetch countries
  useEffect(() => {
    setIsLoading(true);
    getAllCountries()
      .then((countries) => {
        setCountries(countries);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // post address or fail
  const onSubmit = (event: FormEvent<any>) => {
    const formData = new FormData(event.target);
    const address = Object.fromEntries(formData);

    const pendingToast = toast({
      title: "Saving address...",
      status: "loading",
    });

    postAddress(address)
      .then((res) => {
        // reload cached addresses
        getAddressesByUserId(user.id, "reload")
          .then(() => {})
          .catch((error) => console.log(error));
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
        console.log(error);
      });
  };

  // handler function to pass event into onSubmit
  const handleFormSubmit = (event: FormEvent<any>) => {
    event.preventDefault();
    handleSubmit(() => onSubmit(event))();
  };

  const errorMessage = (message: string | undefined) => {
    return <p className={styles.error_message}>{message || ""}</p>;
  };

  if (!isAuthenticated || !user || !user.id) {
    return <SignInRequiredPage props={{ message: "add address" }} />;
  }

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
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && errorMessage(errors.name.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="name">Address line 1</label>
              <input
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
                {...register("address_line_2", {
                  required: "Address line 2 is required",
                })}
              />
              {errors.street && errorMessage(errors.street.message?.toString())}
            </Stack>
            <Stack>
              <label htmlFor="area_code">Postcode</label>
              <input
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
              bgColor={theme.colors.accent.primary}
            >
              Add address
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
