import { Usr } from "@prisma/client";
import { UserWithCurrencyAndCountry } from "../services/userService";
import { fetchData } from ".";

// GET methods

export async function getUserByEmail(
  email: string,
  cache?: RequestCache,
): Promise<UserWithCurrencyAndCountry> {
  return fetchData(`/api/user/by-email/${email}`, cache);
}

// PUT methods

export async function putUserCurrencyById(
  id: string,
  currencyId: number,
): Promise<UserWithCurrencyAndCountry> {
  const response = await fetch(`/api/user/${id}/currency`, {
    method: "PUT",
    body: JSON.stringify({ currencyId: currencyId }),
  });
  if (!response.ok) {
    throw new Error("Error putting user");
  }
  return response.json();
}

export async function putUserCountryById(
  id: string,
  countryId: number,
): Promise<UserWithCurrencyAndCountry> {
  const response = await fetch(`/api/user/${id}/country`, {
    method: "PUT",
    body: JSON.stringify({ countryId: countryId }),
  });
  if (!response.ok) {
    throw new Error("Error putting user");
  }
  return response.json();
}

export async function putUserDefaultAddress(
  id: string,
  addressId: string,
): Promise<UserWithCurrencyAndCountry> {
  const response = await fetch(`/api/user/${id}/addresses/default`, {
    method: "PUT",
    body: JSON.stringify({ addressId: addressId }),
  });
  if (!response.ok) {
    throw new Error("Error putting user");
  }
  return response.json();
}

// POST methods

export async function findOrPostUser(
  user: Partial<Omit<Usr, "usr_id">>,
): Promise<Usr> {
  const response = await fetch(`/api/user/by-email`, {
    method: "POST",
    body: JSON.stringify(user),
    cache: "force-cache",
  });
  if (!response) {
    throw new Error("Error in find or post user");
  }
  return response.json();
}

export async function postUser(
  user: Partial<Omit<Usr, "usr_id">>,
): Promise<Usr> {
  const response = await fetch("/api/user/by-email", {
    method: "POST",
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Error in posting user");
  }
  return response.json();
}
