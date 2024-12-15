import { Address } from "@prisma/client";
import { fetchData } from ".";
import { AddressWithCountry } from "../services/addressService.js";

// GET methods

export async function getAddressById(
  id: string,
  cache?: RequestCache,
): Promise<AddressWithCountry> {
  return fetchData<AddressWithCountry>(`/api/address/${id}`, cache);
}

export async function getAddressesByUserId(
  id: string,
  cache?: RequestCache,
): Promise<AddressWithCountry[]> {
  return fetchData<AddressWithCountry[]>(`/api/user/${id}/addresses`, cache);
}

// POST methods

export async function postAddress(address: Partial<Address>): Promise<Address> {
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

export async function deleteAddressById(id: string): Promise<Address> {
  const response = await fetch(`/api/address/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting address");
  }
  return response.json();
}
