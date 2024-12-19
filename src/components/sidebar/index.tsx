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
import styles from "./index.module.css";
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
      <Card className={styles.container} h="fit-content" minW="2xs">
        <CardHeader paddingBottom={2}>
          <Heading fontSize="lg" fontWeight="semibold">
            Filters
          </Heading>
        </CardHeader>
        <CardBody paddingTop={2} paddingBottom={0}>
          <Stack gap={2}>
            <SortFilter />
            <PriceFilter />
            <ReviewFilter />
            <CategoryFilter />
          </Stack>
        </CardBody>
        <CardFooter paddingTop={1}>
          <HStack gap="1em">
            <Button
              _hover={{ color: theme.colors.accent.secondary }}
              onClick={handleDelete}
            >
              Clear Filters
            </Button>
            <Button
              bgColor={theme.colors.accent.primary}
              onClick={executeSearch}
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
        >
          <HStack gap="0.4em">
            <Text>Filters</Text>
            <ControlOutlined />
          </HStack>
        </Button>
        <Drawer isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading fontSize="lg" fontWeight="semibold">
                Filters
              </Heading>
            </DrawerHeader>
            <DrawerBody>
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
                  _hover={{ color: theme.colors.accent.secondary }}
                  onClick={handleDelete}
                >
                  Clear Filters
                </Button>
                <Button
                  bgColor={theme.colors.accent.primary}
                  onClick={executeSearch}
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
