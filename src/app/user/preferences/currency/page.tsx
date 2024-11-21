"use client";
import { getAllCurrencies } from "@/api/request/currencyRequest";
import { putUserCurrencyById } from "@/api/request/userRequest";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
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
  const { user, isAuthenticated, reload } = useContext(UserContext);
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currencies, setCurrencies] = useState<Currency[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<number>();

  useEffect(() => {
    getAllCurrencies()
      .then((res) => {
        setCurrencies(res);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!isAuthenticated || !user) {
    return <Box>Sign in</Box>;
  }

  const handleSubmit = () => {
    const pendingToast = toast({
      title: "Loading...",
      status: "loading",
      isClosable: true,
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

    putUserCurrencyById(user.id, selectedCurrency)
      .then((res) => {
        toast.update(pendingToast, successToast);
      })
      .catch((error) => {
        toast.update(pendingToast, errorToast);
        location.reload();
      })
      .finally(() => {
        reload()
          .then(() => {
            router.push(redirectUrl);
          })
          .catch((error) => {
            console.error(error);
            router.push(redirectUrl);
          });
      });
  };

  const handleCancel = () => {
    router.push(redirectUrl);
  };

  return (
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
  );
}
