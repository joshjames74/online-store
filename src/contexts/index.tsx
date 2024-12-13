import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "./theme-context";
import { SettingsProvider } from "./settings-context";

export const Provider = (props: { children: JSX.Element }): JSX.Element => {
  const { children }: any = props;
  return (
    <ChakraProvider>
      <SettingsProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SettingsProvider>
    </ChakraProvider>
  );
};
