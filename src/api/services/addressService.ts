import { Address } from "@prisma/client";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

export type AddressWithCountry = ResultType<"address", { country: true }>;

// GET method

export async function getAddressById(
  id: string,
): Promise<AddressWithCountry | null> {
  return await prisma.address.findFirst({
    where: { id: id },
    include: { country: true },
  });
}

export async function getAddressesByUserId(
  id: string,
): Promise<AddressWithCountry[] | void> {
  return await prisma.address.findMany({
    where: { usrId: id, isDeleted: false },
    include: { country: true },
  });
}

// DELETE methods

export async function deleteAddressById(id: string): Promise<Address | void> {
  // if this address is the default for a user, delete that default address
  return prisma.$transaction(async (tx) => {
    // delete the default address for all useres
    const updateUsers = await tx.usr.updateMany({
      where: { defaultAddressId: id },
      data: { defaultAddressId: null },
    });
    if (!updateUsers) {
      throw new Error("Cannot update users");
    }
    // delete by setting isDeleted to true
    const deleteAddress = await tx.address.update({
      where: { id: id },
      data: { isDeleted: true },
    });
    if (!deleteAddress) {
      throw new Error("Cannot delete address");
    }
    return deleteAddress;
  });
}

// POST methods

export async function postAddress(
  address: Omit<Address, "id">,
): Promise<Address | void> {
  console.log("Address Service");
  console.log(address);
  return await prisma.address.create({
    data: address,
  });
}
