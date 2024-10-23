"use client"
import React from "react";
import '@fontsource/open-sans';
import '@fontsource/raleway';

// create interface theme
export interface ITheme {
    theme: {
        fonts: {
            primary: string;
        },
        colors: {
            semantic: {
                success: string,
                error: string,
            },
            accent: {
                primary: string;
                secondary: string;
                tertiary: string;
            },
            text: {
                primary: string;
                secondary: string;
                focus: string;
            },
            background: {
                primary: string;
                secondary: string;
            },
            border: {
                primary: string;
                background: string;
            },
            antCompatible: {
                accent: string,
                primary: string
            }
        }
    }
}

// set default theme
const theme: ITheme = {
    theme: {
        fonts: {
            primary: `'Raleway', sans-serif`
        },
        colors: {
            semantic: {
                success: "green.500",
                error: "red.500"
            },
            accent: {
                primary: "orange.300",
                secondary: "yellow.300",
                tertiary: "teal.600"
            },
            text: {
                primary: "black",
                secondary: "white",
                focus: "orange.300",
            },
            background: {
                primary: "white",
                secondary: "gray.200",
            },
            border: {
                primary: "black",
                background: "gray",
            },
            antCompatible: {
                accent: "orange",
                primary: "grey",
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