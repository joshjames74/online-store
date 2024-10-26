"use client";
import { findOrPostUser } from "@/api/request/userRequest";
import { Prisma, Usr } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react"

export interface IUser {
    user: Usr;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const userData: IUser = {
    user: {} as Usr,
    isAuthenticated: false,
    isLoading: false
}



export const UserContext = React.createContext<IUser>(userData);

export const UserProvider = (props: { children: JSX.Element}): JSX.Element => {

    const { children } = props;

    const { data: session, status } = useSession();
    const [user, setUser] = useState<Usr>({} as Usr);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const loadUser = () => {
        if (session?.user) {
            setIsLoading(true);

            const { name, email, image: image_url } = session.user;
            findOrPostUser({ name, email, image_url}).then(res => setUser(res));
            setIsAuthenticated(status === "authenticated");
            
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [])

    useEffect(() => {
        loadUser();
    }, [session]);


    return (
        <UserContext.Provider value={{ user: user, isLoading: isLoading, isAuthenticated: isAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}