import { Address } from "@prisma/client";
import {
  deleteOneEntityByField,
  getAllEntities,
  getEntitiesByFields,
  getOneEntityByFields,
  postOneEntity,
} from "../helpers/dynamicQuery";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

export type AddressWithCountry = ResultType<"address", { country: true }>

// GET method

export async function getAddressById(id: number): Promise<AddressWithCountry | void> {
  return await getOneEntityByFields({
    modelName: "address",
    whereQuery: { id: id },
    include: { country: true }
  });
}

export async function getAddressesByUserId(
  id: number,
): Promise<ResultType<"address", { country: true }>[] | void> {
  return await getEntitiesByFields({
    modelName: "address",
    whereQuery: { usrId: id, isDeleted: false },
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
  // if this address is the default for a user, delete that default address
  return prisma.$transaction(async (tx) => {
    // delete the default address for all useres
    const updateUsers = await tx.usr.updateMany({ 
      where: { defaultAddressId: id },
      data: { defaultAddressId: null }
    });
    if (!updateUsers) {
      throw new Error("Cannot update users");
    }
    // delete by setting isDeleted to true
    const deleteAddress = await tx.address.update({ 
      where: { id: id },
      data: { isDeleted: true }
    });
    if (!deleteAddress) {
      throw new Error("Cannot delete address");
    };
    return deleteAddress
  });
}


// POST methods

export async function postAddress(
  address: Omit<Address, "id">,
): Promise<Address | void> {
  return await postOneEntity("address", address);
}
