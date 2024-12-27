"use client";
import {
  OrderParams,
} from "@/api/transformers/orderSearchTransformer";
import {
  ReviewParams,
} from "@/api/transformers/reviewSearchTransformer";


import { useSearchParamsState } from "./searchParamStore";
import { useSearchResultsState } from "./searchResultsState";
import { useReviewSearchStore } from "./reviewSearchStore";
import { useOrderSearchStore } from "./orderSearchStore";
import { useBasketState } from "./basketStore";
import { useUserState } from "./userStore";
import { useAddressState } from "./addressState";

export type BasketItemCoreProperties = { [key: number]: number };
export type PageReviewParam = Partial<Omit<ReviewParams, "productId">>;
export type PageOrderParams = Omit<Partial<OrderParams>, "usrId">;


export { useSearchParamsState, useSearchResultsState, useReviewSearchStore, useOrderSearchStore, useBasketState, useUserState, useAddressState };
