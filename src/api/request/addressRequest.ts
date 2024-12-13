import { Address } from "@prisma/client";
import { ResultType } from "../helpers/types.js";
import { fetchData } from ".";
import { AddressWithCountry } from "../services/addressService.js";

// GET methods

export async function getAddressById(id: number, cache?: RequestCache): Promise<AddressWithCountry> {
  return fetchData<AddressWithCountry>(`/api/address/${id}`, cache);
}

export async function getAddressesByUserId(
  id: number,
  cache?: RequestCache,
): Promise<ResultType<"address", { country: true }>[]> {
  return fetchData<ResultType<"address", { country: true }>[]>(
    `/api/user/${id}/addresses`,
    cache,
  );
}

// POST methods

export async function postAddress(
  address: Omit<Address, "id">,
): Promise<Address> {
  const response = await fetch("/api/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  if (!response.ok) {
    throw new Error("Error posting address");
  }
  return response.json();
}

// DELETE methods

export async function deleteAddressById(id: number): Promise<Address> {
  const response = await fetch(`/api/address/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}
