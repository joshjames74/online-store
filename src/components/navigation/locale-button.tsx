import { useUserState } from "@/zustand/store";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  Button,
  Heading,
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

export default function LocaleButton(): JSX.Element {
  const country = useUserState((state) => state.country);
  const currency = useUserState((state) => state.currency);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          display="flex"
          alignContent="center"
          gap="0.4em"
          paddingX="1em"
          minW="fit-content"
          className="secondary-button"
        >
          <Image
            h="full"
            w="auto"
            objectFit="cover"
            src={
              country.image_url
                ? country.image_url
                : "https://flagsapi.com/GB/flat/64.png"
            }
          />
          <CaretDownOutlined />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="max-content">
        <PopoverBody>
          <Stack w="max-content">
            <Heading as="h2">Currency</Heading>
            <HStack justifyContent="space-between" gap="1em">
              <Heading as="h5">
                {currency.symbol && currency.code
                  ? `${currency.symbol} - ${currency.code}`
                  : "£ - GBP"}
              </Heading>
              <Link
                href={`/user/preferences/currency?redirectUrl=${location.pathname}`}
              >
                <Heading as="h5" textDecoration="underline">
                  Change currency
                </Heading>
              </Link>
            </HStack>

            <Heading as="h2">Country</Heading>
            <HStack justifyContent="space-between" gap="1em">
              <Heading as="h5">
                {country.code && country.name
                  ? `${country.code} - ${country.name}`
                  : "GB - United Kingdom"}
              </Heading>
              <Link
                href={`/user/preferences/country?redirectUrl=${location.pathname}`}
              >
                <Heading as="h5" textDecoration="underline">
                  Change country
                </Heading>
              </Link>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
