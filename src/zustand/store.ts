"use client";
import { ManyWithMetadata } from "@/api/helpers/types";
import {
  getAddressById,
  getAddressesByUserId,
} from "@/api/request/addressRequest";
import {
  deleteBasketById,
  deleteBasketItemById,
  getBasketByUserId,
  postBasketItem,
  putBasketItemQuantityById,
} from "@/api/request/basketRequest";
import { getCountryById } from "@/api/request/countryRequest";
import { getCurrencyById } from "@/api/request/currencyRequest";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { getReviewsBySearch } from "@/api/request/reviewRequest";
import {
  getUserById,
  putUserCountryById,
  putUserCurrencyById,
  putUserDefaultAddress,
} from "@/api/request/userRequest";
import { AddressWithCountry } from "@/api/services/addressService";
import { Basket } from "@/api/services/basketItemService";
import { ProductsWithMetadata } from "@/api/services/productService";
import { ReviewWithUser } from "@/api/services/reviewService";
import { OrderParams } from "@/api/transformers/orderSearchTransformer";
import {
  ProductFilter,
  ProductParams,
} from "@/api/transformers/productSearchTransformer";
import { ReviewFilter, ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { Country, Currency, Usr } from "@prisma/client";
import { Session } from "next-auth";
import { create } from "zustand";

export interface SearchParamsState {
  params: Partial<ProductParams>;
  // update functions
  updateQuery: (query: string) => void;
  updateMaxPrice: (max_price: number) => void;
  updateMinReview: (min_review: number) => void;
  updateCategories: (categories: number[]) => void;
  updateProductFilter: (product_filter: ProductFilter) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePerPage: (perPage: number) => void;
  // trigger function
  executeSearch: () => void;
  // clear
  clearParams: () => void;
}

const defaultParams: Partial<ProductParams> = {
  query: "",
  min_review: 0,
  max_price: 0,
  perPage: 20,
  pageNumber: 1,
};
const defaultResults = {} as ManyWithMetadata<"product", { seller: true }>;

export const useSearchParamsState = create<SearchParamsState>((set, get) => ({
  params: defaultParams,
  updateQuery: (query: string) =>
    set((state) => ({ params: { ...state.params, query: query } })),
  updateMaxPrice: (max_price: number) =>
    set((state) => ({ params: { ...state.params, max_price: max_price } })),
  updateMinReview: (min_review: number) =>
    set((state) => ({ params: { ...get().params, min_review: min_review } })),
  updateCategories: (categories: number[]) =>
    set((state) => ({ params: { ...state.params, categories: categories } })),
  updateProductFilter: (product_filter: ProductFilter) =>
    set((state) => ({
      params: { ...state.params, product_filter: product_filter },
    })),
  updatePageNumber: (pageNumber: number) =>
    set((state) => ({ params: { ...state.params, pageNumber: pageNumber } })),
  updatePerPage: (perPage: number) =>
    set((state) => ({ params: { ...state.params, perPage: perPage } })),
  executeSearch: () => {
    const params = get().params;
    useSearchResultsState.getState().fetchAllData(params);
  },
  clearParams: () => {
    // do not update perPage when clearing params
    set(() => ({
      params: { ...defaultParams, perPage: get().params.perPage },
    }));
    get().executeSearch();
  },
}));

export interface SearchResultsState {
  results: ProductsWithMetadata;
  resultsCount: number;
  maxPrice: number;
  maxPages: number;
  setMaxPages: (perPage: number) => void;
  fetchSearchResults: (params: Partial<ProductParams>) => Promise<void>;
  fetchMaxPriceWithoutParams: () => Promise<void>;
  fetchResultsCountWithoutPagination: (
    params: Partial<ProductParams>,
  ) => Promise<void>;
  fetchAllData: (params: Partial<ProductParams>) => Promise<void>;
}

export const useSearchResultsState = create<SearchResultsState>((set, get) => ({
  maxPrice: 0,
  results: defaultResults,
  resultsCount: 0,
  maxPages: 0,
  setMaxPages: () => {
    const perPage = useSearchParamsState.getState().params.perPage;
    const count = get().resultsCount;
    const maxPages = Math.ceil(Math.max(count / (perPage || -1), 0));
    set({ maxPages: maxPages });
  },
  fetchSearchResults: async (params: Partial<ProductParams>) => {
    getProductsBySearchParams(params)
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ results: res });
      })
      .catch((error) => {
        console.error(error);
        set({ results: defaultResults });
      });
  },
  fetchMaxPriceWithoutParams: async () => {
    await getProductsBySearchParams({})
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ maxPrice: res.metadata?.price?.max });
      })
      .catch((error) => {
        console.error(error);
        set({ maxPrice: 0 });
      });
  },
  fetchResultsCountWithoutPagination: async (
    params: Partial<ProductParams>,
  ) => {
    const { perPage, pageNumber, ...paramsWithoutPagination } = params;
    await getProductsBySearchParams(paramsWithoutPagination)
      .then((res) => {
        if (!res) {
          throw new Error("Error fetching results");
        }
        set({ resultsCount: res.metadata.count });
      })
      .catch((error) => {
        console.error(error);
        set({ resultsCount: 0 });
      });
  },
  fetchAllData: async (params: Partial<ProductParams>) => {
    const fetchState = get();
    await fetchState.fetchMaxPriceWithoutParams();
    await fetchState.fetchResultsCountWithoutPagination(params);
    fetchState.setMaxPages(params.perPage || 0);
    fetchState.fetchSearchResults(params);
  },
}));

export type BasketItemCoreProperties = { [key: number]: number };


// Review search state

export type PageReviewParam = Partial<Omit<ReviewParams, "productId">>;

export interface ReviewSearchState {
  productId: number;
  params: PageReviewParam;
  reviews: ReviewWithUser[];

  setParams: (params: PageReviewParam) => void;
  setReviews: (reviews: ReviewWithUser[]) => void;
  setProductId: (productId: number) => void;

  updateParams: (params: PageReviewParam) => void;
  updateReviewFilter: (review_filter: ReviewFilter) => void;
  updateScore: (score: number) => void;
  updateProductId: (productId: number) => void;



  getReviews: () => Promise<void>;
  getAsUrl: () => string;
  clearParams: () => void;
}

export const useReviewSearchStore = create<ReviewSearchState>((set, get) => ({
  productId: -1,
  params: {},
  reviews: [],

  setParams: (params) => set({ params: { ...get().params, ...params } }),
  setReviews: (reviews) => set({ reviews: reviews }),
  setProductId: (productId) => set({ productId: productId }),

  updateParams: (params) => {
    get().setParams(params);
    get().getReviews();
  },
  updateReviewFilter: (review_filter) => {
    get().setParams({ review_filter: review_filter });
    get().getReviews();
  },
  updateScore: (score) => {
    get().setParams({ score: score });
    get().getReviews();
  },
  updateProductId: (productId) => {
    get().setProductId(productId);
    get().getReviews();
  },

  getReviews: async () => {
    const params: Partial<ReviewParams> = { ...get().params, productId: get().productId } ;
    await getReviewsBySearch(params)
      .then((res) => set({ reviews: res }))
      .catch((error) => console.error(error));
  },

  getAsUrl: () => {
    const params = get().params;
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => urlParams.append(key, value.toString()));
    return urlParams.toString();
  },
  clearParams: () => {
    set({ params: {} });
  },
}));

// Order search state
export interface OrderSearchState {
  params: Partial<OrderParams>;
  setParams: (params: Partial<OrderParams>) => void;
  getAsUrl: () => string;
  clearParams: () => void;
}

// Storage states


export const useOrderSearchStore = create<OrderSearchState>((set, get) => {
  return {
    params: {},
    setParams: (params) => set({ params: { ...get().params, ...params } }),
    getAsUrl: () => {
      const params = get().params;
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value.toString());
      });
      return urlParams.toString();
    },
    clearParams: () => set({ params: {} }),
  };
});

// Basket state

export interface BasketState {
  basket: Basket;
  userId: string;

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

  setBasket: (basket: Basket) => set({ basket: basket }),
  setUserId: (userId: string) => set({ userId: userId }),

  updateUserId: (userId: string) => {
    get().setUserId(userId);
    get().fetchBasket();
  },

  fetchBasket: async () => {
    const userId = get().userId;
    if (!userId) {
      return;
    }
    await getBasketByUserId(userId)
      .then((res) => get().setBasket(res))
      .catch((error) => console.error(error));
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
    await putBasketItemQuantityById(id, quantity)
      .then(() => get().fetchBasket()
      .catch((error) => console.error(error)),
  );
  },
  postBasketItem: async (productId: number, quantity: number) => {
    const userId = get().userId;
    if (!userId) {
      return;
    };
    await postBasketItem({
      usrId: userId,
      productId: productId,
      quantity: quantity,
    })
      .then(() => get().fetchBasket())
      .catch((error) => console.error(error));
  },
}));

// USER STATE

export interface UserState {
  user: Usr;
  currency: Currency;
  country: Country;
  defaultAddress: AddressWithCountry;
  
  setUser: (user: Usr) => void;
  setCurrency: (currency: Currency) => void;
  setCountry: (country: Country) => void;
  setDefaultAddress: (address: AddressWithCountry) => void;
  
  updateCurrency: (id: number) => Promise<void>;
  updateCountry: (id: number) => Promise<void>;
  updateDefaultAddress: (id: string) => Promise<void>;
  
  getUser: (sub: string) => Promise<void>;
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
    await get().getUser(userState.id);
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
    
    await get().getUser(userState.id);
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
    
    await get().getUser(userState.id);
    await get().getDefaultAddress();
    await getAddressesByUserId(userState.id);
  },
  getUser: async (sub: string) => {
    // const user = await getUserBySub(sub).catch(
    //   (error) => console.log(error),
    // );
    const user = await getUserById(sub).catch((error) => console.log(error));
    if (!user) {
      return;
    }
    get().setUser(user);
  },
  getCurrency: async () => {
    const userState = get().user;
    if (!userState || !userState.currencyId) {
      return;
    }
    
    const currency = await getCurrencyById(userState.currencyId).catch(
      (error) => console.log(error),
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
  if (!address) {
    return;
  }
  get().setDefaultAddress(address);
},

loadUserState: async (session: any | null) => {
  if (!session?.user || !session?.user?.id) {
    return;
    }
    await get().getUser(session.user.id || "");
    await get().getCurrency();
    await get().getCountry();
    await get().getDefaultAddress();
  },
  reload: async () => {
    const userState = get().user;
    if (!userState || !userState.sub) {
      return;
    }
    await get().getUser(userState.sub);
    await get().getCurrency();
    await get().getCountry();
    await get().getDefaultAddress();
  },
}));
