import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "./theme-context"



export const Provider = (props: { children : JSX.Element}): JSX.Element => {
    const { children }: any = props;
    return (
        <ChakraProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </ChakraProvider>
    )
}