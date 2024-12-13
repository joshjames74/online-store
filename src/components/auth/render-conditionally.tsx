"use client";
import SignInRequiredPage from "./sign-in-required-page";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { Usr } from "@prisma/client";
import { useUserState } from "@/zustand/store";

export function isLoggedIn(
  user: UserWithCurrencyAndCountry | Usr,
): boolean {
  if (!user) {
    return false;
  }
  if (!user.id) {
    return false;
  }
  return true;
}

// logged in functions
export function RenderPageIfLoggedIn({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const user = useUserState((state) => state.user);
  if (!isLoggedIn(user)) {
    return <SignInRequiredPage />;
  }
  return <>{children}</>;
}

export function RenderComponentIfLoggedIn({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const user = useUserState((state) => state.user);
  if (!isLoggedIn(user)) {
    return <></>
  }
  return <>{children}</>;
}

// logged out function
export function RenderPageIfLoggedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const user = useUserState((state) => state.user);
  if (isLoggedIn(user)) {
    <></>;
  }
  return <>{children}</>;
}

export function RenderComponentIfLoggedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const user = useUserState((state) => state.user);
  if (isLoggedIn(user)) {
    return <></>;
  }
  return <>{children}</>;
}
