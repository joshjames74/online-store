import { Card, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export type AccountCardProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
  href?: string;
};

export default function AccountCard(props: AccountCardProps): JSX.Element {
  return (
    <Link href={props.href ? props.href : ""}>
      <Card w="300px" h="120px" padding="1em" border="1px solid lightgrey">
        <HStack>
          <Stack>
            <Heading as="h3">{props.title}</Heading>
            <Text as="h4">{props.subtitle}</Text>
          </Stack>
        </HStack>
      </Card>
    </Link>
  );
}
