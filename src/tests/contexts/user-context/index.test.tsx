import {
  generateMockCountry,
  generateMockCurrency,
  generateMockUser,
} from "@/tests/generate";
import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import * as UserRequest from "../../../api/request/userRequest";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { render, waitFor } from "@testing-library/react";
import { IUser, UserContext, UserProvider } from "@/contexts/user-context";
import React from "react";

jest.mock("next-auth/react");
jest.mock("./../../../api/request/userRequest", () => ({
  getUserByEmail: jest.fn(),
  postUser: jest.fn(),
}));

// to do: simulate error in posting user

describe("Mock the user context", () => {
  let activeUser: UserWithCurrencyAndCountry;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const count = 2;

    const mockCountry = generateMockCountry();
    const mockCurrency = generateMockCurrency();

    const mockUsers = Array.from({ length: count }, generateMockUser);
    const userIds = mockUsers.map((user) => user.id);

    activeUser = Object.assign(mockUsers[0], {
      id: 1,
      currency: mockCurrency,
      country: mockCountry,
    });
  });

  it("user exists and valid session: should render", async () => {
    const session = {
      data: {
        user: { name: activeUser.name, email: activeUser.email },
        expires: faker.date.future(),
      },
      status: "authenticated",
    };
    (useSession as jest.Mock).mockReturnValue(session);
    (UserRequest.getUserByEmail as jest.Mock).mockResolvedValue(activeUser);

    render(
      <UserProvider>
        <></>
      </UserProvider>,
    );
    expect(true).toBe(true);
  });

  it("user exists and valid session: should store correct user and auth status", async () => {
    const session = {
      data: {
        user: { name: activeUser.name, email: activeUser.email },
        expires: faker.date.future(),
      },
      status: "authenticated",
    };
    (useSession as jest.Mock).mockReturnValue(session);
    (UserRequest.getUserByEmail as jest.Mock).mockResolvedValue(activeUser);

    let context: IUser = {} as IUser;

    const ContextConsumer = () => {
      context = React.useContext(UserContext);
      return null;
    };

    render(
      <UserProvider>
        <ContextConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(context.user).toEqual(activeUser);
    });

    expect(context.isAuthenticated).toEqual(true);
    expect(context.isLoading).toEqual(false);
  });

  it("user does not exist and valid session: should call post user", async () => {
    const session = {
      data: {
        user: { name: activeUser.name, email: activeUser.email },
        expires: faker.date.future(),
      },
      status: "authenticated",
    };
    (useSession as jest.Mock).mockReturnValue(session);
    (UserRequest.getUserByEmail as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(activeUser);
    (UserRequest.postUser as jest.Mock).mockResolvedValue(activeUser);

    let context: IUser = {} as IUser;

    const ContextConsumer = () => {
      context = React.useContext(UserContext);
      return null;
    };

    render(
      <UserProvider>
        <ContextConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(context.user).toEqual(activeUser);
    });

    expect(context.isAuthenticated).toEqual(true);
    expect(context.isLoading).toEqual(false);
  });

  it("user does not exist and invalid session: should call post user", async () => {
    const session = { data: {}, status: "unauthenticated" };
    (useSession as jest.Mock).mockReturnValue(session);
    let context: IUser = {} as IUser;

    const ContextConsumer = () => {
      context = React.useContext(UserContext);
      return null;
    };

    render(
      <UserProvider>
        <ContextConsumer />
      </UserProvider>,
    );

    expect(context.isAuthenticated).toEqual(false);
    expect(context.isLoading).toEqual(false);
  });
});
