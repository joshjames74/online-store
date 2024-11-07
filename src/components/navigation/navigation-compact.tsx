import { ThemeContext } from "@/contexts/theme-context"
import { Stack, HStack, Button, Drawer, DrawerOverlay, DrawerHeader, DrawerFooter, Link, Heading, DrawerContent, DrawerCloseButton, DrawerBody, useDisclosure } from "@chakra-ui/react"
import { useContext } from "react"
import logo from "./../../app/logo.png";
import Image from "next/image";
import { MenuOutlined } from "@ant-design/icons";
import SearchBar from "./search-bar";
import BasketButton from "./basket-button";
import { UserContext } from "@/contexts/user-context";


export default function NavigationCompact(): JSX.Element {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { theme } = useContext(ThemeContext);
    const { isAuthenticated, isLoading } = useContext(UserContext);

    const header = (isLoggedIn: boolean) => {
        return (
        <HStack paddingX="1em" paddingY="0.4em" alignContent="center" justifyContent="space-between">
            <HStack>
                <Button onClick={onOpen} backgroundColor={theme.colors.antCompatible.background} padding={0} _hover={{ border: "1px solid white"}}>
                    <MenuOutlined style={{ color: theme.colors.antCompatible.text, fontSize: "20px" }}/>
                </Button>
                <Image src={logo} alt="" objectFit="cover" width={150}/>
            </HStack>
            {isLoggedIn ? <BasketButton /> : <></>}
        </HStack>
        )
    }

    return (
    <>
        <Stack bgColor={theme.colors.background.accent}>
            {header(!isLoading && isAuthenticated)}
            <SearchBar />
        </Stack>
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>

                <DrawerBody>
                    <Stack>
                        <Link href="/user/account">
                            <Heading fontSize="md" fontWeight="semibold">
                                Your account
                            </Heading>
                        </Link>
                        <Link href="/user/preferences/currency">
                            <Heading fontSize="md" fontWeight="semibold">
                                Edit Currency
                            </Heading>
                        </Link>
                    </Stack>
                </DrawerBody>
            </DrawerContent>

        </Drawer>
    </>
)
}