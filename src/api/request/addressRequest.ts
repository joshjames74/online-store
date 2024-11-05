import { Address } from "@prisma/client";
import axios from "axios";
import { buildUrl } from "../helpers/utils";
import { ResultType } from "../helpers/types";

export async function getAddressesByUserId(id: number): Promise<ResultType<"address", { country: true}>[]> {
    const request = await axios(`/api/user/${id}/addresses`, { method: "GET" });
    return request.data;
};


// POST methods

export async function postAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address)
    });
    if (!response.ok) {
        throw new Error('Error posting address');
    }
    return response.json();
}


// DELETE methods

export async function deleteAddressById(id: number): Promise<Address> {
    const response = await fetch(`/api/address/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error('Error deleting address');
    }
    return response.json();
}