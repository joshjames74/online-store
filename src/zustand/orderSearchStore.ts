import { OrderWithMetadata } from "@/api/services/orderService";
import { PageOrderParams } from "./store";
import {
  OrderFilter,
  OrderParams,
} from "@/api/transformers/orderSearchTransformer";
import { create } from "zustand";
import { getOrdersByUserId } from "@/api/request/orderRequest";

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
