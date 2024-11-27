import { QueryParams } from "@/redux/reducers/product";
import { ProductParams, Width } from "../transformers/productSearchTransformer";
import {
  OrderFilter,
  OrderParams,
} from "../transformers/orderSearchTransformer";
import { UserWithCurrencyAndCountry } from "../services/userService";

export const objectToQueryParams = (params: any): string => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export const buildUrl = (route: string, params: any): string => {
  return `${route}?${objectToQueryParams(params)}`;
};

export const parseDate = (
  searchParams: URLSearchParams,
  key: string,
): Date | undefined => {
  const date_raw = searchParams.get(key);
  if (!date_raw) {
    return undefined;
  }
  return new Date(date_raw);
};

export const parseQueryParams = (
  searchParams: URLSearchParams,
): ProductParams => {
  // to do: only add to params if truthy
  const query = searchParams.get("query") || "";
  const max_price = parseFloat(searchParams.get("max_price") || "0");
  const min_review = parseFloat(searchParams.get("min_review") || "0");
  const perPage = parseInt(searchParams.get("perPage") || "");
  const pageNumber = parseInt(searchParams.get("pageNumber") || "");
  const categories = searchParams.getAll("categories").length
    ? searchParams
        .getAll("categories")[0]
        .split(",")
        .filter((val) => !isNaN(parseInt(val)))
        .map((val) => parseInt(val))
    : [];
  const product_filter = parseInt(searchParams.get("product_filter") || "");
  return { query, max_price, min_review, categories, perPage, pageNumber, product_filter, width: Width.WIDE };
};

export const parseOrderSearchParams = (
  searchParams: URLSearchParams,
): Omit<OrderParams, "usrId"> => {
  const min_date = parseDate(searchParams, "min_date");
  const max_date = parseDate(searchParams, "max_date");
  const skip = parseInt(searchParams.get("skip") || "");
  const take = parseInt(searchParams.get("take") || "");

  let params = {};
  if (min_date) {
    Object.assign(params, { min_date });
  }
  if (max_date) {
    Object.assign(params, { max_date });
  }
  if (skip) {
    Object.assign(params, { skip });
  }
  if (take) {
    Object.assign(params, { take });
  }

  const order_filter_raw = parseInt(searchParams.get("order_filter") || "");
  let order_filter: OrderFilter;

  if (
    order_filter_raw &&
    Object.values(OrderFilter).includes(order_filter_raw as OrderFilter)
  ) {
    order_filter = order_filter_raw as OrderFilter;
    Object.assign(params, { order_filter });
  }
  return params as OrderParams;
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function convertPrice(priceInGBP: number, exchangeRate: number): number {
  return priceInGBP / exchangeRate;
}

export function convertAndFormatToUserCurrency(
  price: number,
  user: UserWithCurrencyAndCountry,
): string {
  const currency =
    user && user.currency
      ? user.currency
      : { symbol: "£", code: "GBP", id: "1", gbp_exchange_rate: 1 };
  const userPrice = convertPrice(price,  currency.gbp_exchange_rate);
  return formatPrice(userPrice, currency.code);
}

export function formatReviewScore(score: number): number {
  return Math.round(score * 100) / 100;
}