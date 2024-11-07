import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, HStack, Stack, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import styles from "./index.module.css"
import ReviewFilter from "./review-filter";
import PriceFilter from "./price-filter";
import CategoryFilter from "./category-filter";
import { useSearchStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import { ControlOutlined } from "@ant-design/icons";


export default function Sidebar(): JSX.Element {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLargerThan800px] = useMediaQuery('(min-width: 800px)');
    const router = useRouter();

    const clearFilters = useSearchStore((state) => state.clearParams);

    const handleDelete = () => {
        clearFilters();
        router.refresh();
    }

    const renderFilters = (): JSX.Element => {
        return (
            <Stack gap={2}>
                <PriceFilter />
                <ReviewFilter />
                <CategoryFilter />
            </Stack>
        )
    }

    const renderFooter = (): JSX.Element => {
        return (
            <Text textDecoration="underline" _hover={{color: theme.colors.accent.secondary}} onClick={handleDelete}>Clear Filters</Text>
        )
    }

    const renderHeading = (): JSX.Element => {
        return (<Heading fontSize="lg" fontWeight="semibold">Filters</Heading>)
    }


    const sidebar = () => {
        return (
        <Card className={styles.container} h="fit-content" minW="2xs">
            <CardHeader paddingBottom={2}>{renderHeading()}</CardHeader>
            <Divider />
            <CardBody paddingTop={2} paddingBottom={0}>{renderFilters()}</CardBody>
            <CardFooter paddingTop={1}>{renderFooter()}</CardFooter>
        </Card>
        )
    }

    const drawer = () => {
        return (
            <>
                <Button onClick={onOpen} w="fit-content">
                    <HStack gap="0.4em">
                        <Text>Filters</Text>
                        <ControlOutlined />
                    </HStack>
                </Button>
                <Drawer isOpen={isOpen} onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>{renderHeading()}</DrawerHeader>
                        <DrawerBody>{renderFilters()}</DrawerBody>
                        <DrawerFooter>{renderFooter()}</DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }

    return isLargerThan800px ? sidebar() : drawer();

}