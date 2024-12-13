import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { useUserState } from "@/zustand/store";
import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
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
        >
          <Image
            h="full"
            w="auto"
            objectFit="cover"
            src={
              country
                ? country.image_url
                : "https://flagsapi.com/GB/flat/64.png"
            }
          />
          <CaretDownOutlined />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Stack>
            <Heading fontSize="md">Currency</Heading>
            <HStack justifyContent="space-between">
              <Text>
                {currency
                  ? `${currency.symbol} - ${currency.code}`
                  : "£ - GBP"}
              </Text>
              <Link
                href={`/user/preferences/currency?redirectUrl=${location.pathname}`}
              >
                <Text textDecoration="underline">Change currency</Text>
              </Link>
            </HStack>

            <Heading fontSize="md">Country</Heading>
            <HStack justifyContent="space-between">
              <Text>
                {country
                  ? `${country.code} - ${country.name}`
                  : "GB - United Kingdom"}
              </Text>
              <Link
                href={`/user/preferences/country?redirectUrl=${location.pathname}`}
              >
                <Text textDecoration="underline">Change country</Text>
              </Link>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
