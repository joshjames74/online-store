import { getAddressById } from "@/api/request/addressRequest";
import { getCountryById } from "@/api/request/countryRequest";
import { getCurrencyById } from "@/api/request/currencyRequest";
import { getUserAuthById, getUserAuthBySub } from "@/api/request/userAuthRequest";
import { getUserByAuthId, putUserCountryById, putUserCurrencyById, putUserDefaultAddress } from "@/api/request/userRequest";
import { AddressWithCountry } from "@/api/services/addressService";
import { Country, Currency, Usr } from "@prisma/client";
import { Session } from "next-auth";
import { create } from "zustand";

export interface UserState {
    user: Usr;
    currency: Currency;
    country: Country;
    defaultAddress: AddressWithCountry;
    isLoading: boolean;
  
    setUser: (user: Usr) => void;
    setCurrency: (currency: Currency) => void;
    setCountry: (country: Country) => void;
    setDefaultAddress: (address: AddressWithCountry) => void;
  
    updateCurrency: (id: number) => Promise<void>;
    updateCountry: (id: number) => Promise<void>;
    updateDefaultAddress: (id: string) => Promise<void>;
  
    getUserBySub: (sub: string) => Promise<void>;
    getUser: () => Promise<void>;
    getCurrency: () => Promise<void>;
    getCountry: () => Promise<void>;
    getDefaultAddress: () => Promise<void>;
  
    loadUserState: (session: Session | null) => Promise<void>;
    reload: () => Promise<void>;
  }
  
  export const useUserState = create<UserState>((set, get) => ({
    user: {} as Usr,
    currency: {} as Currency,
    country: {} as Country,
    defaultAddress: {} as AddressWithCountry,
    isLoading: false,
  
    setUser: (user: Usr) => set({ user: user }),
    setCurrency: (currency: Currency) => set({ currency: currency }),
    setCountry: (country: Country) => set({ country: country }),
    setDefaultAddress: (address: AddressWithCountry) =>
      set({ defaultAddress: address }),
  
    updateCurrency: async (id: number) => {
      // check user
      const userState = get().user;
      if (!userState || !userState.id) {
        return;
      }
  
      // update user country
      const updatedUser = await putUserCurrencyById(userState.id, id).catch(
        (error) => console.error(error),
      );
      if (!updatedUser) {
        return;
      }
  
      // update user and currency
      await get().getUser();
      await get().getCurrency();
    },
  
    updateCountry: async (id: number) => {
      //
      const userState = get().user;
      if (!userState || !userState.id) {
        return;
      }
  
      const updatedUser = await putUserCountryById(userState.id, id).catch(
        (error) => console.error(error),
      );
      if (!updatedUser) {
        return;
      }
  
      await get().getUser();
      await get().getCountry();
    },
    updateDefaultAddress: async (id: string) => {
      const userState = get().user;
      if (!userState || !userState.id) {
        return;
      }
  
      const updatedUser = await putUserDefaultAddress(userState.id, id).catch(
        (error) => console.error(error),
      );
  
      if (!updatedUser) {
        return;
      }
  
      await get().getUser();
      await get().getDefaultAddress();
    },
    getUserBySub: async (sub: string) => {
      set({ isLoading: true });
      const userAuth = await getUserAuthBySub(sub).catch(error => console.error(error));
      if (!userAuth) {
        return;
      };
      const user = await getUserByAuthId(userAuth.id).catch(error => console.error(error));
      if (!user) {
        return;
      };
      get().setUser(user);
      set({ isLoading: false });
    },
    getUser: async () => {
      set({ isLoading: true });
      const userState = get().user;
      if (!userState || !userState.authId) {
        return;
      }
      const userAuth = await getUserAuthById(userState.authId);
      if (!userAuth || !userAuth.sub) {
        return;
      }
      const user = await getUserByAuthId(userAuth.id);
      if (user) {
        get().setUser(user);
      };
      set({ isLoading: false });
    },
  
    getCurrency: async () => {
      const userState = get().user;
      if (!userState || !userState.currencyId) {
        return;
      }
  
      const currency = await getCurrencyById(userState.currencyId).catch(
        (error) => console.error(error),
      );
      if (!currency) {
        return;
      }
      get().setCurrency(currency);
    },
    getCountry: async () => {
      const userState = get().user;
      if (!userState || !userState.countryId) {
        return;
      }
  
      const country = await getCountryById(userState.countryId).catch((error) =>
        console.error(error),
      );
      if (!country) {
        return;
      }
      get().setCountry(country);
    },
    getDefaultAddress: async () => {
      const userState = get().user;
      if (!userState || !userState.defaultAddressId) {
        return;
      }
  
      const address = await getAddressById(userState.defaultAddressId);
      get().setDefaultAddress(address);
    },
  
    loadUserState: async (session: any | null) => {
      if (!session?.user || !session?.user?.sub) {
        return;
      }
      await get().getUserBySub(session.user.sub || "");
      await get().getCurrency();
      await get().getCountry();
      await get().getDefaultAddress();
    },
    reload: async () => {
      const userState = get().user;
      if (!userState || !userState.authId) {
        return;
      }
      const userAuth = await getUserAuthById(userState.authId);
      if (!userAuth || !userAuth.sub) {
        return;
      }
      await get().getUser();
      await get().getCurrency();
      await get().getCountry();
      await get().getDefaultAddress();
    },
  }));
  