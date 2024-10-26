import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "./theme-context"
import { UserProvider } from "./user-context";



export const Provider = (props: { children : JSX.Element}): JSX.Element => {
    const { children }: any = props;
    return (
        <ChakraProvider>
            <ThemeProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}