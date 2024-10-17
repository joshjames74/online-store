import { QueryParams } from "@/redux/reducers/product";
import { ProductParams } from "../transformers/productSearchTransformer";


export const parseQueryParams = (searchParams: URLSearchParams): ProductParams => {

    const query = searchParams.get('query') || '';
    const max_price = parseFloat(searchParams.get('max_price') || '0');
    const min_review = parseFloat(searchParams.get('min_review') || '0');
    const skip = parseInt(searchParams.get('skip') || '');
    const take = parseInt(searchParams.get('take') || '');
    const categories = searchParams.getAll('categories').length
                       ? searchParams.getAll('categories')[0].split(",").filter(val => !isNaN(parseInt(val))).map(val => parseInt(val))
                       : []

    return { query, max_price, min_review, categories, skip, take };
}