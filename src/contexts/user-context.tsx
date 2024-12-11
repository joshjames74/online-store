"use client";
import { getUserByEmail, postUser } from "@/api/request/userRequest";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

// define context types

export interface IUser {
  user: UserWithCurrencyAndCountry;
  isAuthenticated: boolean;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const userData: IUser = {
  user: {} as UserWithCurrencyAndCountry,
  isAuthenticated: false,
  isLoading: false,
  reload: () => new Promise(() => {}),
};

// helper method

export const findOrPostUser = async (
  email: string,
  name: string,
  image_url: string,
): Promise<UserWithCurrencyAndCountry> => {
  // find user. if found, return
  const user = await getUserByEmail(email).catch((error) =>
    console.error(error),
  );
  if (user) {
    return user;
  }

  // if not found (or error), post user
  const post = await postUser({ email, name, image_url }).catch((error) =>
    console.error(error),
  );
  if (!post) {
    return {} as UserWithCurrencyAndCountry;
  }

  // now get the new user
  const newUser = await getUserByEmail(post.email, "force-cache").catch(
    (error) => console.error(error),
  );
  if (newUser) {
    return newUser;
  }

  return {} as UserWithCurrencyAndCountry;
};

// define context

export const UserContext = React.createContext<IUser>(userData);

export const UserProvider = (props: { children: JSX.Element }): JSX.Element => {
  const { children } = props;

  // set state
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithCurrencyAndCountry>(
    {} as UserWithCurrencyAndCountry,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // if logged out, do nothing. if logged in, find or create profile
  const loadUser = async () => {
    if (!session?.user || !session?.user?.email) {
      return;
    }

    const { name, email, image: image_url } = session.user;
    findOrPostUser(email, name ? name : "", image_url ? image_url : "")
      .then((user) => setUser(user))
      .catch((error) => console.error(error));
  };

  // on reload, if logged in then get the user again (force reload)
  const reload = async (): Promise<void> => {
    if (!session?.user || !session?.user?.email) {
      return;
    }
    setIsLoading(true);
    getUserByEmail(session.user.email, "reload")
      .then((user) => setUser(user))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // if the user exists and the session hasn't changed
    if (session?.user?.email === user.email && user.email?.length) {
      return;
    }
    setIsLoading(true);
    loadUser();
    setIsAuthenticated(status === "authenticated");
    setIsLoading(false);
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user: user,
        isLoading: isLoading,
        isAuthenticated: isAuthenticated,
        reload: reload,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
