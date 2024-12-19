"use client";
import SignInRequiredPage from "./sign-in-required-page";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { Usr } from "@prisma/client";
import { useUserState } from "@/zustand/store";
import { useSession } from "next-auth/react";

export function isLoggedIn(user: UserWithCurrencyAndCountry | Usr): boolean {
  if (!user || !user.id) {
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
  // const user = useUserState((state) => state.user);
  // console.log("At render page");
  // console.log(user);
  // if (!isLoggedIn(user)) {
  //   return <SignInRequiredPage />;
  // }
  const { status } = useSession();
  if (status === "unauthenticated") {
    return <SignInRequiredPage />;
  }
  if (status === "loading") {
    return <></>;
  }
  return <>{children}</>;
}

export function RenderComponentIfLoggedIn({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  // const user = useUserState((state) => state.user);
  // if (!isLoggedIn(user)) {
  //   return <></>;
  // }
  const { status } = useSession();
  if (status === "unauthenticated") {
    return <></>;
  }
  if (status === "loading") {
    return <></>;
  }
  return <>{children}</>;
}

// logged out function
export function RenderPageIfLoggedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  // const user = useUserState((state) => state.user);
  // if (isLoggedIn(user)) {
  //   <></>;
  // }
  const { status } = useSession();
  if (status === "authenticated" || status === "loading") {
    return <></>;
  }
  return <>{children}</>;
}

export function RenderComponentIfLoggedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  // const user = useUserState((state) => state.user);
  // if (isLoggedIn(user)) {
  //   return <></>;
  // }
  const { status } = useSession();
  if (status === "authenticated" || status === "loading") {
    return <></>;
  }
  return <>{children}</>;
}

// loading
export function RenderPageIfLoading({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { status } = useSession();
  if (status !== "loading") {
    <></>;
  }
  return <>{children}</>;
}

export function RenderComponentIfLoading({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { status } = useSession();
  if (status !== "loading") {
    return <></>;
  }
  return <>{children}</>;
}
