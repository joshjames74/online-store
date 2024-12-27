import { deleteBasketById, deleteBasketItemById, getBasketByUserId, postBasketItem, putBasketItemQuantityById } from "@/api/request/basketRequest";
import { Basket } from "@/api/services/basketItemService";
import { create } from "zustand";

export interface BasketState {
  basket: Basket;
  userId: string;
  isLoading: boolean;

  setBasket: (basket: Basket) => void;
  setUserId: (userId: string) => void;

  updateUserId: (userId: string) => void;

  fetchBasket: () => Promise<void>;
  deleteBasket: () => Promise<void>;
  putBasketItem: (id: string, quantity: number) => Promise<void>;
  deleteBasketItem: (id: string) => Promise<void>;
  postBasketItem: (productId: number, quantity: number) => Promise<void>;
}

export const useBasketState = create<BasketState>((set, get) => ({
  basket: {} as Basket,
  userId: "",
  isLoading: false,

  setBasket: (basket: Basket) => set({ basket: basket }),
  setUserId: (userId: string) => set({ userId: userId }),

  updateUserId: (userId: string) => {
    get().setUserId(userId);
    get().fetchBasket();
  },

  fetchBasket: async () => {
    set({ isLoading: true });
    const userId = get().userId;
    if (!userId) {
      return;
    }
    await getBasketByUserId(userId)
      .then((res) => get().setBasket(res))
      .catch((error) => console.error(error));
    set({ isLoading: false });
  },

  deleteBasket: async () => {
    const userId = get().userId;
    await deleteBasketById(userId)
      .then((res) => get().fetchBasket())
      .catch((error) => console.error(error));
  },
  deleteBasketItem: async (id: string) => {
    await deleteBasketItemById(id)
      .then(() => get().fetchBasket())
      .catch((error) => console.error(error));
  },

  putBasketItem: async (id: string, quantity: number) => {
    await putBasketItemQuantityById(id, quantity).then(() =>
      get()
        .fetchBasket()
        .catch((error) => console.error(error)),
    );
  },
  postBasketItem: async (productId: number, quantity: number) => {
    const userId = get().userId;
    if (!userId) {
      return;
    }
    await postBasketItem({
      usrId: userId,
      productId: productId,
      quantity: quantity,
      created_at: new Date(Date.now()),
    })
      .then(() => get().fetchBasket())
      .catch((error) => console.error(error));
  },
}));