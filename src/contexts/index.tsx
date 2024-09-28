import { ThemeProvider } from "./theme-context"

export const Provider = (props: { children : JSX.Element}): JSX.Element => {
    const { children }: any = props;
    return (
        <ThemeProvider>{children}</ThemeProvider>
    )
}