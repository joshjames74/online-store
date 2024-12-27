import { ThemeContext } from "@/contexts/theme-context";
import {
  Stack,
  HStack,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  Link,
  Heading,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  DrawerFooter,
  Box,
} from "@chakra-ui/react";
import { MenuOutlined } from "@ant-design/icons";
import SearchBar from "./search-bar";
import BasketButton from "./basket-button";
import Logo from "./logo";
import { RenderComponentIfLoggedIn, RenderComponentIfLoggedOut } from "../auth/render-conditionally";


export default function NavigationCompact(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Stack bgColor="var(--primary-text)" padding="1em">
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center">
            <Button onClick={onOpen} className="secondary-button">
              <MenuOutlined
                style={{
                  color: "var(--secondary-text)",
                  fontSize: "20px",
                }}
              />
            </Button>
            <Logo />
          </HStack>
          <RenderComponentIfLoggedIn><BasketButton /></RenderComponentIfLoggedIn>
        </HStack>
        <SearchBar />
      </Stack>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading as="h1">Menu</Heading>
          </DrawerHeader>

          <DrawerBody>
            <Stack w="150px">
              <RenderComponentIfLoggedIn>
                <Link href="/user/account">
                  <Button className="primary-button" w="100%">Your Account</Button>
                </Link>
              </RenderComponentIfLoggedIn>
              <RenderComponentIfLoggedOut>
                <Link href="/auth/signin">
                  <Button className="primary-button" w="100%">Sign In</Button>
                </Link>
              </RenderComponentIfLoggedOut>
              <RenderComponentIfLoggedIn>
                <Link href="/user/basket">
                  <Button className="primary-button" w="100%">Your Basket</Button>
                </Link>
              </RenderComponentIfLoggedIn>
              <RenderComponentIfLoggedIn>
                <Link href="/user/orders">
                  <Button className="primary-button" w="100%">Your Orders</Button>
                </Link>
              </RenderComponentIfLoggedIn>
              <RenderComponentIfLoggedIn>
                <Link href="/user/addresses">
                  <Button className="primary-button" w="100%">Your Addresses</Button>
                </Link>
              </RenderComponentIfLoggedIn>
              <RenderComponentIfLoggedIn>
                <Link href="/user/preferences/currency">
                  <Button className="primary-button" w="100%">Edit Currency</Button>
                </Link>
              </RenderComponentIfLoggedIn>
              <RenderComponentIfLoggedIn>
                <Link href="/user/preferences/country">
                  <Button className="primary-button" w="100%">Edit Country</Button>
                </Link>
              </RenderComponentIfLoggedIn>
            </Stack>
          </DrawerBody>
          <DrawerFooter justifyContent="left">
            <Box w="150px">
              <RenderComponentIfLoggedIn>
                <Link href="/auth/signout">
                  <Button className="primary-button" w="100%">Sign Out</Button>
                </Link>
              </RenderComponentIfLoggedIn>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
