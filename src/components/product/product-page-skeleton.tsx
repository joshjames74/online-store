import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function ProductPageSkeleton(): JSX.Element {
  return (
    <HStack h="fit-content" alignItems="stretch">
      <Card minW="sm" maxW="5xl" w="full" h="300px">
        <CardBody>
          <HStack
            h="full"
            alignItems="stretch"
            sx={{
              "@media screen and (max-width: 600px)": {
                flexDirection: "column",
              },
            }}
          >
            <Skeleton minW="300px" h="full" />
            <Stack h="full" w="full">
              <Skeleton h="80px" />
              <Divider />
              <SkeletonText noOfLines={10} />
            </Stack>
          </HStack>
        </CardBody>
      </Card>
      <Card h="300px" alignSelf="stretch" minW="sm" paddingX="1em">
        <CardHeader>
          <Heading fontSize="md" fontWeight="semibold">
            Add to basket
          </Heading>
        </CardHeader>
        <CardBody h="200px">
          <Stack h="full">
            <Skeleton w="full" h="full" />
            <Skeleton w="full" h="full" />
            <Skeleton w="full" h="full" />
          </Stack>
        </CardBody>
      </Card>
    </HStack>
  );
}
