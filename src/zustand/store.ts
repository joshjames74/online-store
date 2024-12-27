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
import { getOrdersByUserId } from "@/api/request/orderRequest";
import { getProductsBySearchParams } from "@/api/request/productRequest";
import { getReviewsBySearch } from "@/api/request/reviewRequest";
import { getUserAuthById, getUserAuthBySub } from "@/api/request/userAuthRequest";
import {
  getUserByAuthId,
  putUserCountryById,
  putUserCurrencyById,
  putUserDefaultAddress,
} from "@/api/request/userRequest";
import { AddressWithCountry } from "@/api/services/addressService";
import { Basket } from "@/api/services/basketItemService";
import { OrderWithMetadata } from "@/api/services/orderService";
import { ProductsWithMetadata } from "@/api/services/productService";
import { ReviewWithUser } from "@/api/services/reviewService";
import {
  OrderFilter,
  OrderParams,
} from "@/api/transformers/orderSearchTransformer";
import {
  ProductFilter,
  ProductParams,
} from "@/api/transformers/productSearchTransformer";
import {
  ReviewFilter,
  ReviewParams,
} from "@/api/transformers/reviewSearchTransformer";
import { Country, Currency, Order, Usr } from "@prisma/client";
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
  isLoading: boolean;
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
  isLoading: false,
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
    set({ isLoading: true });
    const fetchState = get();
    await fetchState.fetchMaxPriceWithoutParams();
    await fetchState.fetchResultsCountWithoutPagination(params);
    fetchState.setMaxPages(params.perPage || 0);
    await fetchState.fetchSearchResults(params);
    set({ isLoading: false });
  },
}));

export type BasketItemCoreProperties = { [key: number]: number };

// Review search state

export type PageReviewParam = Partial<Omit<ReviewParams, "productId">>;

export interface ReviewSearchState {
  productId: number;
  params: PageReviewParam;
  reviews: ReviewWithUser[];
  maxPages: number;
  isLoading: boolean;

  setParams: (params: PageReviewParam) => void;
  setReviews: (reviews: ReviewWithUser[]) => void;
  setProductId: (productId: number) => void;
  setMaxPages: (maxPages: number) => void;

  updateParams: (params: PageReviewParam) => void;
  updateReviewFilter: (review_filter: ReviewFilter) => void;
  updateScore: (score: number) => void;
  updateProductId: (productId: number) => void;
  updatePerPage: (perPage: number) => void;
  updatePageNumber: (pageNumber: number) => void;

  getMaxPages: () => Promise<void>;
  getReviews: () => Promise<void>;
  clearParams: () => void;
  resetPagination: () => void;
}

export const useReviewSearchStore = create<ReviewSearchState>((set, get) => ({
  productId: -1,
  params: { perPage: 5, pageNumber: 1 },
  reviews: [],
  maxPages: 1,
  isLoading: false,

  setParams: (params) => set({ params: { ...get().params, ...params } }),
  setReviews: (reviews) => set({ reviews: reviews }),
  setProductId: (productId) => set({ productId: productId }),
  setMaxPages: (maxPages: number) => set({ maxPages: maxPages }),

  updateParams: (params) => {
    get().setParams(params);
    get().getReviews();
  },
  updateReviewFilter: (review_filter) => {
    get().setParams({ review_filter: review_filter });
    get().resetPagination();
    get().getReviews();
  },
  updateScore: (score) => {
    get().setParams({ score: score });
    get().resetPagination();
    get().getReviews();
  },
  updateProductId: (productId) => {
    get().setProductId(productId);
    get().resetPagination();
    get().getReviews();
  },
  updatePageNumber: (pageNumber: number) => {
    get().setParams({ pageNumber: pageNumber });
    get().getReviews();
  },
  updatePerPage: (perPage: number) => {
    get().setParams({ perPage: perPage });
  },

  getMaxPages: async () => {
    const params: Partial<ReviewParams> = {
      ...get().params,
      productId: get().productId,
    };
    const { pageNumber, perPage, ...paramsWithoutPagination } = params;
    const response = await getReviewsBySearch(paramsWithoutPagination).catch(
      (error) => error,
    );
    const count = response.length;
    const maxPages = Math.ceil(Math.max(count / (perPage || -1), 0));
    get().setMaxPages(maxPages);
  },
  getReviews: async () => {
    set({ isLoading: true });
    await get().getMaxPages();
    const productId = get().productId;
    const params: Partial<ReviewParams> = {
      ...get().params,
      productId: productId,
    };
    await getReviewsBySearch(params)
      .then((res) => set({ reviews: res }))
      .catch((error) => console.error(error));
    set({ isLoading: false });
  },
  clearParams: () => {
    set({ params: { pageNumber: 1, perPage: 5 } });
    get().getReviews();
  },
  resetPagination: () => {
    set({ params: { ...get().params, pageNumber: 1, perPage: 5 } });
  },
}));

// Order search state

export type PageOrderParams = Omit<Partial<OrderParams>, "usrId">;

export interface OrderSearchState {
  isLoading: boolean;
  params: PageOrderParams;
  userId: string;
  orders: OrderWithMetadata[];
  maxPages: number;

  setParams: (params: Partial<OrderParams>) => void;
  setUserId: (id: string) => void;
  setOrders: (orders: OrderWithMetadata[]) => void;
  setMaxPages: (maxPages: number) => void;

  updateMinDate: (min_date: Date) => void;
  updateMaxDate: (max_date: Date) => void;
  updateOrderFilter: (order_filter: OrderFilter) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePerPage: (perPage: number) => void;
  updateUserId: (id: string) => void;

  getOrders: () => Promise<void>;
  getMaxPages: () => Promise<void>;

  clearParams: () => void;
  resetDate: () => void;
  resetPagination: () => void;
}

export const useOrderSearchStore = create<OrderSearchState>((set, get) => ({
  isLoading: false,
  params: { pageNumber: 1, perPage: 5 } as PageOrderParams,
  userId: "",
  orders: [] as OrderWithMetadata[],
  maxPages: 1,

  setParams: (params) => set({ params: { ...get().params, ...params } }),
  setUserId: (id: string) => set({ userId: id }),
  setOrders: (orders: OrderWithMetadata[]) => set({ orders: orders }),
  setMaxPages: (maxPages: number) => set({ maxPages: maxPages }),

  updateMinDate: (min_date: Date) => {
    get().setParams({ min_date: min_date });
    get().resetPagination();
    get().getOrders();
  },
  updateMaxDate: (max_date: Date) => {
    get().setParams({ max_date: max_date });
    get().resetPagination();
    get().getOrders();
  },
  updateOrderFilter: (order_filter: OrderFilter) => {
    get().setParams({ order_filter: order_filter });
    get().resetPagination();
    get().getOrders();
  },
  updatePageNumber: (pageNumber: number) => {
    get().setParams({ pageNumber: pageNumber });
    get().getOrders();
  },
  updatePerPage: (perPage: number) => {
    get().setParams({ perPage: perPage });
  },
  updateUserId: (id: string) => {
    get().setUserId(id);
    get().resetPagination();
    get().getOrders();
  },

  getOrders: async () => {
    set({ isLoading: true });
    await get().getMaxPages();
    const params = get().params;
    const id = get().userId;
    await getOrdersByUserId({ id, params })
      .then((res) => get().setOrders(res))
      .catch((error) => console.error(error))
      .finally(() => set({ isLoading: false }));
  },
  getMaxPages: async () => {
    const params = get().params;
    const { pageNumber, perPage, ...paramsWithoutPagination }: PageOrderParams =
      params;
    const id = get().userId;
    const response = await getOrdersByUserId({
      id: id,
      params: paramsWithoutPagination,
    }).catch((error) => console.error(error));
    const count = response?.length || 0;
    const maxPages = Math.ceil(Math.max(count / (perPage || -1), 0));
    get().setMaxPages(maxPages);
  },

  clearParams: () => set({ params: {} }),
  resetDate: () => {
    get().setParams({
      min_date: new Date(0),
      max_date: new Date(9999999999999),
    });
  },
  resetPagination: () => {
    set({ params: { ...get().params, pageNumber: 1, perPage: 5 } });
  },
}));

// Basket state

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

// USER STATE

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
    const userAuth = await getUserAuthBySub(sub).catch(error => console.log(error));
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

export interface AddressState {
  userId: string;
  addresses: AddressWithCountry[];
  isLoading: boolean;

  setUserId: (userId: string) => void;
  setAddresses: (addresses: AddressWithCountry[]) => void;

  getAddresses: () => Promise<void>;
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
}));
