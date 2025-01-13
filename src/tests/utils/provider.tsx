import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@/contexts/theme-context";

export function renderWithProvider(children: JSX.Element): any {
  return render(
    <ChakraProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ChakraProvider>,
  );
}
