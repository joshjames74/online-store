import React from "react";

// create interface theme
export interface ITheme {
    theme: {
        fonts: {
            primary: string;
        },
        colors: {
            accent: {
                primary: string;
                secondary: string;
            },
            text: {
                primary: string;
                secondary: string;
            },
            background: {
                primary: string;
                secondary: string;
            },
            border: {
                primary: string;
                background: string;
            }
        }
    }
}

// set default theme
const theme: ITheme = {
    theme: {
        fonts: {
            primary: "Arial"
        },
        colors: {
            accent: {
                primary: "teal.500",
                secondary: "yellow.100",
            },
            text: {
                primary: "black",
                secondary: "blue",
            },
            background: {
                primary: "white",
                secondary: "teal.100",
            },
            border: {
                primary: "black",
                background: "white",
            }
        }
    }
}

// create context
export const ThemeContext = React.createContext<ITheme>(theme);


// create provider
export const ThemeProvider = (props: { children: JSX.Element }): JSX.Element => {
    const { children }: any = props;
    return ( <ThemeContext.Provider value={theme}>
                {children}
             </ThemeContext.Provider>
    )
}