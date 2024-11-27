import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@/contexts/theme-context";
import { IUser, UserContext } from "@/contexts/user-context";

export function renderWithProvider(children: JSX.Element, user: IUser): any {
  return render(
    <ChakraProvider>
      <ThemeProvider>
        <UserContext.Provider value={{ ...user }}>
          {children}
        </UserContext.Provider>
      </ThemeProvider>
    </ChakraProvider>,
  );
}
