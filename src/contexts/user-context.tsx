import { findOrPostUser } from "@/api/request/userRequest";
import { Usr } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react"

export interface IUser {
    user: Usr | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const userData: IUser = {
    user: undefined,
    isAuthenticated: false,
    isLoading: false
}



export const UserContext = React.createContext<IUser>(userData);

export const UserProvider = (props: { children: JSX.Element}): JSX.Element => {

    const { children } = props;

    const { data: session, status } = useSession();
    const [user, setUser] = useState<Usr>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const loadUser = () => {
        if (session?.user) {
            setIsLoading(true);
            const { name, email, image: image_url } = session.user;
            console.log(name, email, image_url);
            findOrPostUser({ name, email, image_url}).then(res => setUser(res));
            setIsLoading(false);
        }
        setIsAuthenticated(status === "authenticated");
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