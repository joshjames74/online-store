import { Usr } from "@prisma/client";
import {
  deleteOneEntityByField,
  getAllEntities,
  getEntitiesByFields,
  getOneEntityByFields,
  postOneEntity,
  putOneEntityByField,
  upsertOneEntityByField,
} from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { ResultType } from "../helpers/types.js";
import prisma from "@/lib/prisma";

export type UserWithCurrencyAndCountry = ResultType<
  "usr",
  { currency: true; country: true }
>;

// GET methods

export async function getUserById(id: number): Promise<Usr | void> {
  return getOneEntityByFields({
    modelName: "usr",
    whereQuery: { id: id },
  });
}

export async function getUsersByCountryId(id: number): Promise<Usr[] | void> {
  return getEntitiesByFields({
    modelName: "usr",
    whereQuery: { countryId: id },
  });
}

export async function getAllUsers(): Promise<Usr[] | void> {
  return getAllEntities("usr");
}

export async function getUserByEmail(
  email: string,
): Promise<UserWithCurrencyAndCountry | void> {
  return getOneEntityByFields({
    modelName: "usr",
    whereQuery: { email: email },
    include: { currency: true, country: true },
  });
}

// POST methods

export async function postUser(
  user: Partial<Omit<Usr, "user_id">>,
): Promise<Usr | void> {
  return postOneEntity("usr", user);
}

// DELETE methods

export async function deleteUserById(id: number): Promise<Usr | void> {
  return deleteOneEntityByField("usr", "id", id);
}

// PUT methods

export async function putUserByFields({ params }: { params: {
  searchField: FieldValuePair<"usr">,
  putFields: FieldValuePair<"usr">[],
}}): Promise<Usr | void> {
  const { searchField, putFields } = params;
  return await putOneEntityByField("usr", searchField, putFields);
};

export async function putUserDefaultAddress({ params }: { params: { userId: number, addressId: number } }): Promise<Usr | void> {
  const { userId, addressId } = params;
  return prisma.$transaction(async (tx) => {

    // ensure that the address was created by this user
    const address = await tx.address.findFirst({ where: { id: addressId }});
    if (!address) throw new Error ("Cannot find address");
    if (address.usrId !== userId ) throw new Error("Invalid address");

    // change the current default address to a non-default address
    const user = await tx.usr.findFirst({ where: { id: userId } });
    if (!user) throw new Error("Cannot find user");
    const prevAddressId = user.defaultAddressId;
    const prevAddress = await tx.address.update({ 
      where: { id: prevAddressId }, 
      data: { isDefault: false }
    });
    if (!prevAddress) throw new Error("Cannot update prev address");

    // update user default address id
    const updatedUser = await tx.usr.update({ 
      where: { id: userId }, 
      data: { defaultAddressId: addressId }
    });
    if (!updatedUser) throw new Error("Cannot update default address id");

    // update is default status of address
    const updatedAddress = await tx.address.update({ 
      where: { id: addressId }, 
      data: { isDefault: true }
    });
    if (!updatedAddress) throw new Error("Canoot update isdefault");

    return updatedUser;
  })
};

export async function upsertUserByEmail(
  user: Partial<Omit<Usr, "user_id">>,
): Promise<Usr | void> {
  const updateQuery = { name: user.name, image_url: user.image_url };
  const createQuery = {
    name: user.name,
    image_url: user.image_url,
    email: user.email,
  };
  return upsertOneEntityByField(
    "usr",
    { email: user.email },
    updateQuery,
    createQuery,
  );
}
