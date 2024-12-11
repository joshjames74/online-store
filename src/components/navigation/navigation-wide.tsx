import { HStack } from "@chakra-ui/react";
import SearchBar from "./search-bar";
import BasketButton from "./basket-button";
import DeliveryButtonLoggedOut from "./delivery-button/delivery-button-logged-out";
import DeliveryButtonLoggedIn from "./delivery-button/delivery-button-logged-in";
import AccountButtonLoggedIn from "./account-button/account-button-logged-in";
import LocaleButton from "./locale-button";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { UserContext } from "@/contexts/user-context";
import SignInButton from "./account-button/sign-in-button";
import Logo from "./logo";

export default function NavigationWide(): JSX.Element {
  const { theme } = useContext(ThemeContext);
  const { user, isAuthenticated, isLoading } = useContext(UserContext);

  const renderLoading = (): JSX.Element => {
    return (
      <HStack
        bgColor={theme.colors.background.accent}
        padding="1em"
        alignContent="center"
      >
        <Logo />
        <SearchBar />
        <SignInButton />
      </HStack>
    );
  };

  const renderLoggedOut = (): JSX.Element => {
    return (
      <HStack
        bgColor={theme.colors.background.accent}
        padding="1em"
        alignContent="center"
      >
        <Logo />
        <DeliveryButtonLoggedOut />
        <SearchBar />
        <SignInButton />
      </HStack>
    );
  };

  const renderLoggedIn = (): JSX.Element => {
    return (
      <HStack
        bgColor={theme.colors.background.accent}
        padding="1em"
        alignContent="center"
        w="full"
      >
        <Logo />
        <DeliveryButtonLoggedIn props={{ user: user }} />
        <SearchBar />
        <LocaleButton props={{ user: user }} />
        <AccountButtonLoggedIn props={{ user: user }} />
        <BasketButton />
      </HStack>
    );
  };

  if (isLoading) {
    return renderLoading();
  }
  if (!isAuthenticated || !user) {
    return renderLoggedOut();
  }
  if (isAuthenticated && user) {
    return renderLoggedIn();
  }

  return <></>;
}
