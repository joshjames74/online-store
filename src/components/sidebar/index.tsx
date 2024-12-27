import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useSearchParamsState } from "@/zustand/store";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { ControlOutlined } from "@ant-design/icons";
import SortFilter from "./sort-filter";

export default function Sidebar(): JSX.Element {
  const { theme } = useContext(ThemeContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan800px] = useMediaQuery("(min-width: 800px)");

  const clearParams = useSearchParamsState((state) => state.clearParams);
  const executeSearch = useSearchParamsState((state) => state.executeSearch);

  const handleDelete = () => {
    clearParams();
    executeSearch();
  };

  const sidebar = () => {
    return (
      <Card h="fit-content" minW="250px" shadow="none" padding="0">
        <CardHeader paddingBottom={2} paddingX="0" paddingTop="0">
          <Heading as="h2" className="upper">
            Filters
          </Heading>
        </CardHeader>
        <CardBody paddingTop={2} paddingBottom={0} paddingX={0}>
          <Stack gap="1em">
            <SortFilter />
            <PriceFilter />
            <ReviewFilter />
            <CategoryFilter />
          </Stack>
        </CardBody>
        <CardFooter paddingTop="1em" paddingX={0}>
          <HStack gap="1em">
            <Button
              className="primary-button"
              onClick={handleDelete}
              bgColor={`${theme.colors.background.secondary} !important`}
            >
              Clear Filters
            </Button>
            <Button
              className="primary-button"
              onClick={executeSearch}
              bgColor={`${theme.colors.accent.primary} !important`}
            >
              Search
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  const drawer = () => {
    return (
      <>
        <Button
          onClick={onOpen}
          w="fit-content"
          bgColor={theme.colors.background.primary}
          className="primary-button"
          gap="0.4em"
        >
          Filters
          <ControlOutlined />
        </Button>
        <Drawer isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading as="h2" className="upper">
                Filters
              </Heading>
            </DrawerHeader>
            <DrawerBody className="sans-serif">
              <Stack gap={2}>
                <SortFilter />
                <PriceFilter />
                <ReviewFilter />
                <CategoryFilter />
              </Stack>
            </DrawerBody>
            <DrawerFooter>
              <HStack gap="1em">
                <Button
                  className="primary-button"
                  onClick={handleDelete}
                  bgColor={`${theme.colors.background.secondary} !important`}
                >
                  Clear Filters
                </Button>
                <Button
                  className="primary-button"
                  onClick={executeSearch}
                  bgColor={`${theme.colors.accent.primary} !important`}
                >
                  Search
                </Button>
              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  };

  return isLargerThan800px ? sidebar() : drawer();
}
