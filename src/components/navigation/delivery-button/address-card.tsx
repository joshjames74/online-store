import { AddressWithCountry } from "@/api/services/addressService";
import { Avatar, Card, HStack, Stack, Text } from "@chakra-ui/react";

export default function AddressCard({
  params,
}: {
  params: { address: AddressWithCountry; isSelected: boolean };
}): JSX.Element {
  const { address, isSelected } = params;

  return (
    <Card
      cursor="pointer"
      boxSizing="border-box"
      border={isSelected ? "2px solid blue" : ""}
      padding="0.4em"
    >
      <HStack>
        <Avatar src={address.country.image_url} />
        <Stack gap="0">
          <Text noOfLines={1} textOverflow="ellipsis" fontWeight="bold">
            {address.name}
          </Text>
          <Text>{address.address_line_1}</Text>
        </Stack>
      </HStack>
    </Card>
  );
}
