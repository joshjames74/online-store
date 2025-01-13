import { AddressWithCountry } from "@/api/services/addressService";
import { Avatar, Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";

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
      shadow="none"
      padding="0.4em"
      className={isSelected ? "primary-border" : ""}
    >
      <HStack>
        <Avatar src={address.country.image_url} />
        <Stack gap="0">
          <Heading className="noOfLines-1" as="h5">
            {address.name}
          </Heading>
          <Heading as="h6">{address.address_line_1}</Heading>
        </Stack>
      </HStack>
    </Card>
  );
}
