import { HStack } from "@chakra-ui/react";
import SearchBar from "./search-bar";
import BasketButton from "./basket-button";
import DeliveryButtonLoggedOut from "./delivery-button/delivery-button-logged-out";
import DeliveryButtonLoggedIn from "./delivery-button/delivery-button-logged-in";
import AccountButtonLoggedIn from "./account-button/account-button-logged-in";
import LocaleButton from "./locale-button";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import SignInButton from "./account-button/sign-in-button";
import Logo from "./logo";
import {
  RenderComponentIfLoading,
  RenderComponentIfLoggedIn,
  RenderComponentIfLoggedOut,
} from "../auth/render-conditionally";

export default function NavigationWide(): JSX.Element {
  const { theme } = useContext(ThemeContext);

  const renderLoading = (): JSX.Element => {
    return (
      <HStack bgColor="black" padding="1em" alignContent="center">
        <Logo />
        <SearchBar />
        <SignInButton />
      </HStack>
    );
  };

  const renderLoggedOut = (): JSX.Element => {
    return (
      <HStack bgColor="black" padding="1em" alignContent="center">
        <Logo />
        <DeliveryButtonLoggedOut />
        <SearchBar />
        <SignInButton />
      </HStack>
    );
  };

  const renderLoggedIn = (): JSX.Element => {
    return (
      <HStack bgColor="black" padding="1em" alignContent="center" w="full">
        <Logo />
        <DeliveryButtonLoggedIn />
        <SearchBar />
        <LocaleButton />
        <AccountButtonLoggedIn />
        <BasketButton />
      </HStack>
    );
  };

  return (
    <>
      <RenderComponentIfLoading>{renderLoading()}</RenderComponentIfLoading>
      <RenderComponentIfLoggedIn>{renderLoggedIn()}</RenderComponentIfLoggedIn>
      <RenderComponentIfLoggedOut>
        {renderLoggedOut()}
      </RenderComponentIfLoggedOut>
    </>
  );
}
