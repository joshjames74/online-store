import axios from "axios";
import { OrderParams } from "../transformers/orderSearchTransformer";

export async function getOrderViewById(id: number): Promise<any> {
    const response = await axios(`/api/order/${id}`, { method: "GET"});
    return response
}

// should be under user?
export async function getOrderViewsBySearch(params: OrderParams): Promise<any> {
    console.log(params);
    const response = await axios(`/api/order`, { 
        method: "GET",
        params: {...params}
    });
    return response.data;
}