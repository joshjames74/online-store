import { Address } from "@prisma/client";
import {
  deleteOneEntityByField,
  getAllEntities,
  getEntitiesByFields,
  getOneEntityByFields,
  postOneEntity,
} from "../helpers/dynamicQuery";
import { ResultType } from "../helpers/types.js";

// GET method

export async function getAddressById(id: number): Promise<Address | void> {
  return await getOneEntityByFields({
    modelName: "address",
    whereQuery: { id: id },
  });
}

export async function getAddressesByUserId(
  id: number,
): Promise<ResultType<"address", { country: true }>[] | void> {
  return await getEntitiesByFields({
    modelName: "address",
    whereQuery: { usrId: id },
    include: { country: true },
  });
}

export async function getAddressesByCountryId(
  id: number,
): Promise<Address[] | void> {
  return await getEntitiesByFields({
    modelName: "address",
    whereQuery: { countryId: id },
  });
}

export async function getAllAddresses(): Promise<Address[] | void> {
  return await getAllEntities("address");
}

// DELETE methods

export async function deleteAddressById(id: number): Promise<Address | void> {
  return await deleteOneEntityByField("address", "id", id);
}

// POST methods

export async function postAddress(
  address: Omit<Address, "id">,
): Promise<Address | void> {
  return await postOneEntity("address", address);
}
