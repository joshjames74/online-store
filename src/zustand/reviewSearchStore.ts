import { ReviewWithUser } from "@/api/services/reviewService";
import { PageReviewParam } from "./store";
import { ReviewFilter, ReviewParams } from "@/api/transformers/reviewSearchTransformer";
import { create } from "zustand";
import { getReviewsBySearch } from "@/api/request/reviewRequest";

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