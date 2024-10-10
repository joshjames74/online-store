import { ThemeProvider } from "./theme-context"
import { ChakraProvider } from "@chakra-ui/react";


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