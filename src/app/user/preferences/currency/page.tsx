"use client";
import { getAllCurrencies } from "@/api/request/currencyRequest";
import { RenderPageIfLoggedIn } from "@/components/auth/render-conditionally";
import { ThemeContext } from "@/contexts/theme-context";
import { useUserState } from "@/zustand/store";
import {
  Box,
  Button,
  Heading,
  Select,
  Stack,
  Text,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { Currency } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

export default function Page({
  params,
}: {
  params: { redirectUrl: string };
}): JSX.Element {
  const redirectUrl = params.redirectUrl || "/";

  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currencies, setCurrencies] = useState<Currency[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<number>();

  const updateCurrency = useUserState((state) => state.updateCurrency);

  useEffect(() => {
    getAllCurrencies()
      .then((res) => setCurrencies(res))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = () => {
    const pendingToast = toast({
      title: "Loading...",
      status: "loading",
      isClosable: true,
      id: "toast"
    });
    const successToast = {
      title: "Success",
      status: "success",
      duration: 1000,
    } as Omit<UseToastOptions, "id">;
    const errorToast = {
      title: "Error",
      status: "error",
      duration: 5000,
    } as Omit<UseToastOptions, "id">;

    if (!selectedCurrency) {
      return;
    }

    updateCurrency(selectedCurrency)
      .then(() => {
        toast.update("toast", successToast);
        router.push(redirectUrl);
      })
      .catch(() => toast.update("toast", errorToast));
  };

  const handleCancel = () => {
    router.push(redirectUrl);
  };

  return (
    <RenderPageIfLoggedIn>
      <>
      <title>Currency</title>
      <Box w="full" justifyItems="center" marginTop="1em">
        <Stack w="fit-content">
          <Heading>Change currency</Heading>
          <Text>Select the currency you want to shop with.</Text>

          {isLoading || !currencies || !currencies.length ? (
            <></>
          ) : (
            <Stack>
              <Select
                placeholder="Select currency"
                onChange={(event) =>
                  setSelectedCurrency(parseInt(event.target.value || ""))
                }
                >
                {currencies.map((currency: Currency, index: number) => {
                  return (
                    <option key={index} value={currency.id}>
                      {currency.code}
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
                  isDisabled={!!!selectedCurrency}
                  onClick={handleSubmit}
                  >
                  Save changes
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
      </>
    </RenderPageIfLoggedIn>
  );
}
