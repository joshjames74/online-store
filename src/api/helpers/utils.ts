import { QueryParams } from "@/redux/reducers/product";
import { ProductParams } from "../transformers/productSearchTransformer";
import { OrderFilter, OrderParams } from "../transformers/orderSearchTransformer";


export const objectToQueryParams = (params: any): string => {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)   
        .join("&")
};


export const buildUrl = (route: string, params: any): string => {
    return `${route}?${objectToQueryParams(params)}`;
}


export const parseDate = (searchParams: URLSearchParams, key: string): Date | undefined => {

    const date_raw = searchParams.get(key);
    if (!date_raw) { return undefined }
    return new Date(date_raw);

}

export const parseQueryParams = (searchParams: URLSearchParams): ProductParams => {

    const query = searchParams.get('query') || '';
    const max_price = parseFloat(searchParams.get('max_price') || '0');
    const min_review = parseFloat(searchParams.get('min_review') || '0');
    const perPage = parseInt(searchParams.get('perPage') || '');
    const pageNumber = parseInt(searchParams.get('pageNumber') || '');
    const categories = searchParams.getAll('categories').length
                       ? searchParams.getAll('categories')[0].split(",").filter(val => !isNaN(parseInt(val))).map(val => parseInt(val))
                       : []

    return { query, max_price, min_review, categories, perPage, pageNumber };
}


export const parseOrderSearchParams = (searchParams: URLSearchParams): OrderParams => {

    // to do: relook at parsing date

    const usrId = parseInt(searchParams.get('usrId') || '');
    const min_date = parseDate(searchParams, 'min_date');
    const max_date = parseDate(searchParams, 'max_date');
    const skip = parseInt(searchParams.get('skip') || '');
    const take = parseInt(searchParams.get('take') || '');

    const order_filter_raw = parseInt(searchParams.get('order_filter') || '');
    var order_filter: OrderFilter;

    if (order_filter_raw && Object.values(OrderFilter).includes(order_filter_raw as OrderFilter)) {
        order_filter = order_filter_raw as OrderFilter;
    }

    return { usrId, min_date, max_date, order_filter, skip, take }

}

