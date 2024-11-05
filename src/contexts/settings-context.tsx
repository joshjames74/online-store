import { Country, Currency } from "@prisma/client";
import React from "react";

export interface ISettings {
    defaultCurrency: Currency,
    defaultCountry: Country,
};

const SettingsData: ISettings = {
    defaultCurrency: { id: 1, code: "GBP", symbol: "£", gbp_exchange_rate: 1 },
    defaultCountry: { id: 1, name: "United Kingdom", code: "GB", image_url: "" }
}

const SettingsContext = React.createContext<ISettings>(SettingsData);


export const SettingsProvider = (props: { children: JSX.Element}): JSX.Element => {

    const { children } = props;

    return (
        <SettingsContext.Provider value={SettingsData}>
            {children}
        </SettingsContext.Provider>
    )

}