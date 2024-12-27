import { getAddressesByUserId } from "@/api/request/addressRequest";
import { AddressWithCountry } from "@/api/services/addressService";
import { create } from "zustand";

export interface AddressState {
    userId: string;
    addresses: AddressWithCountry[];
    isLoading: boolean;
  
    setUserId: (userId: string) => void;
    setAddresses: (addresses: AddressWithCountry[]) => void;
  
    getAddresses: () => Promise<void>;
    updateUserId: (userId: string) => Promise<void>;
  }
  
  export const useAddressState = create<AddressState>((set, get) => ({
    userId: "",
    addresses: [],
    isLoading: false,
  
    setUserId: (userId: string) => set({ userId: userId }),
    setAddresses: (addresses: AddressWithCountry[]) =>
      set({ addresses: addresses }),
  
    getAddresses: async () => {
      set({ isLoading: true });
      const userId = get().userId;
      await getAddressesByUserId(userId)
        .then((res) => get().setAddresses(res))
        .catch((error) => console.error(error));
      set({ isLoading: false });
    },

    updateUserId: async (userId: string) => {
      get().setUserId(userId);
      await get().getAddresses();
    } 

  }));