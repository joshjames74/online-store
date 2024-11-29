"use client";
import { getUserByEmail, postUser } from "@/api/request/userRequest";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

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


export const findOrPostUser = async (
  email: string,
  name: string,
  image_url: string,
): Promise<UserWithCurrencyAndCountry> => {

  // find user. if found, return
  try {
    const user = await getUserByEmail(email);
    if (user) {
      return user;
    }
  } catch (error) {
    console.error(error);
  }

  // if not found (or error), post user
  try {
    const post = await postUser({ email, name, image_url });
    if (post) {
      try {
        const user = await getUserByEmail(post.email);
        if (user) {
          return user;
        }
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return {} as UserWithCurrencyAndCountry;
};


export const UserContext = React.createContext<IUser>(userData);


export const UserProvider = (props: { children: JSX.Element }): JSX.Element => {
  const { children } = props;

  // set state
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithCurrencyAndCountry>(
    {} as UserWithCurrencyAndCountry,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // load user from session, 
  const loadUser = async () => {
    if (!session?.user) {
      return;
    }
    const { name, email, image: image_url } = session.user;
    if (!email) {
      return;
    }
    findOrPostUser(email, name ? name : "", image_url ? image_url : "")
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const reload = async (): Promise<void> => {
    setIsLoading(true);
    if (!session?.user) {
      return;
    }

    const { email } = session.user;
    if (!email) {
      return;
    }
    getUserByEmail(email, "reload")
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   loadUser();
  //   setIsAuthenticated(status === "authenticated");
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
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
