"use client";
import { getAllCountries } from "@/api/request/countryRequest";
import { putUserCountryById } from "@/api/request/userRequest";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { useUserState } from "@/zustand/store";
import {
  Box,
  Button,
  Heading,
  Select,
  Stack,
  TabList,
  Text,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { Country, Currency } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext, useRef } from "react";

export default function Page({
  params,
}: {
  params: { redirectUrl: string };
}): JSX.Element {
  const redirectUrl = params.redirectUrl || "/";

  const { theme } = useContext(ThemeContext);
  const { user, reload } = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countries, setCountries] = useState<Country[]>();
  const [selectedCountry, setSelectedCountry] = useState<number>();

  const updateCountry = useUserState((state) => state.updateCountry);

  useEffect(() => {
    getAllCountries()
      .then((res) => {
        setCountries(res);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // if (!isAuthenticated || !user) {
  //   return <Box>Sign in</Box>;
  // }

  const handleSubmit = () => {
    const pendingToast = toast({
      title: "Loading...",
      status: "loading",
      isClosable: true,
      id: "toast",
    });
    const successToast = {
      title: "Country changed successfully",
      status: "success",
      duration: 1000,
    } as Omit<UseToastOptions, "id">;
    const errorToast = {
      title: "Error",
      status: "error",
      duration: 5000,
    } as Omit<UseToastOptions, "id">;

    if (!selectedCountry) {
      return;
    }

    updateCountry(selectedCountry)
      .then(() => {
        toast.update("toast", successToast);
        router.push(redirectUrl);
      })
      .catch(error => toast.update("toast", errorToast));
    // putUserCountryById(user.id, selectedCountry)
    //   .then((res) => {
    //     toast.update("toast", successToast);
    //   })
    //   .catch((error) => {
    //     toast.update("toast", errorToast);
    //     location.reload();
    //   })
    //   .finally(() => {
    //     reload()
    //       .then(() => {
    //         router.push(redirectUrl);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         router.push(redirectUrl);
    //       });
    //   });
  };

  const handleCancel = () => {
    router.push(redirectUrl);
  };

  return (
    <RenderPageIfLoggedIn>
      <Box w="full" justifyItems="center" marginTop="1em">
        <Stack w="fit-content">
          <Heading>Change country</Heading>
          <Text>Select the country you want.</Text>

          {isLoading || !countries || !countries.length ? (
            <></>
          ) : (
            <Stack>
              <Select
                placeholder="Select country"
                onChange={(event) =>
                  setSelectedCountry(parseInt(event.target.value || ""))
                }
              >
                {countries.map((country: Country, index: number) => {
                  return (
                    <option key={index} value={country.id}>
                      {country.code} - {country.name}
                    </option>
                  );
                })}
              </Select>

              <Box display="flex" gap="1em">
                <Button
                  bgColor={theme.colors.background.secondary}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  bgColor={theme.colors.accent.primary}
                  isDisabled={!!!selectedCountry}
                  onClick={handleSubmit}
                >
                  Save changes
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
    </RenderPageIfLoggedIn>
  );
}
