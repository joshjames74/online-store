import { Usr } from "@prisma/client";
import axios from "axios";
import { ResultType } from "../helpers/types";
import { UserWithCurrencyAndCountry } from "../services/userService";


// GET methods

export async function getUserByEmail(email: string, cache?: RequestCache): Promise<UserWithCurrencyAndCountry> {
    const response = await fetch(`/api/user/by-email/${email}`, { 
        method: "GET",
        //cache: cache ? cache : "force-cache"
    });
    if (!response.ok) {
        throw new Error('Error getting user');
    };
    return response.json();
}


// PUT methods

export async function putUserCurrencyById(id: number, currencyId: number): Promise<UserWithCurrencyAndCountry> {
    const response = await fetch(`/api/user/${id}`, {
        method: "PUT",
        body: JSON.stringify({ currencyId: currencyId })
    })
    if (!response.ok) {
        throw new Error('Error putting user');
    }
    return response.json();
}

export async function putUserCountryById(id: number, countryId: number): Promise<UserWithCurrencyAndCountry> {
    const response = await fetch(`/api/user/${id}`, {
        method: "PUT",
        body: JSON.stringify({ countryId: countryId })
    })
    if (!response.ok) {
        throw new Error('Error putting user');
    }
    return response.json();
}


// POST methods 

export async function findOrPostUser(user: Partial<Omit<Usr, 'usr_id'>>): Promise<Usr> {
    const response = await fetch(`/api/user/by-email`, {
        method: "POST",
        body: JSON.stringify(user),
        cache: "force-cache"
    });
    if (!response) {
        throw new Error('Error in find or post user');
    }
    return response.json();
}

export async function postUser(user: Partial<Omit<Usr, 'usr_id'>>): Promise<Usr> {
    const response = await fetch("/api/user/by-email", {
        method: "POST",
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Error in posting user');
    }
    return response.json()
}