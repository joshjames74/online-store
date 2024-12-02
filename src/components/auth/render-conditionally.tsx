"use client";
import { UserContext } from "@/contexts/user-context";
import { useContext } from "react";
import SignInRequiredPage from "./sign-in-required-page";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { Usr } from "@prisma/client";
import { Spinner } from "@chakra-ui/react";


export function isLoggedIn(isAuthenticated: boolean, user: UserWithCurrencyAndCountry | Usr): boolean {
    if (!isAuthenticated) {
        return false;
    }
    if (!user) {
        return false;
    }
    if (!user.id) {
        return false;
    }
    return true
}

// logged in functions
export function RenderPageIfLoggedIn({ children }: { children: JSX.Element}): JSX.Element {
    const { user, isAuthenticated, isLoading } = useContext(UserContext)
    if (isLoading) {
        return <></>
    }
    if (!isLoggedIn(isAuthenticated, user)) {
        return <SignInRequiredPage props={{ message: "" }}/>
    }
    return <>{children}</>
}

export function RenderComponentIfLoggedIn({ children }: { children: JSX.Element}): JSX.Element {
    const { user, isAuthenticated, isLoading } = useContext(UserContext)
    if (isLoading) {
        return <></>
    }
    if (!isLoggedIn(isAuthenticated, user)) {
        return <></>
    }
    return <>{children}</>
}

// logged out function
export function RenderPageIfLoggedOut({ children }: { children: JSX.Element}): JSX.Element {
    const { user, isAuthenticated, isLoading } = useContext(UserContext)
    if (isLoading) {
        return <></>
    }
    if (isLoggedIn(isAuthenticated, user)) {
        <></>
    }
    return <>{children}</>
}

export function RenderComponentIfLoggedOut({ children }: { children: JSX.Element}): JSX.Element {
    const { user, isAuthenticated, isLoading } = useContext(UserContext)
    if (isLoading) {
        return <></>
    }
    if (isLoggedIn(isAuthenticated, user)) {
        return <></>
    }
    return <>{children}</>
}

