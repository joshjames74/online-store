import { Usr } from "@prisma/client";
import {
  deleteOneEntityByField,
  getAllEntity,
  getEntitiesByField,
  getOneEntityByField,
  postOneEntity,
  putOneEntityByField,
  upsertOneEntityByField,
} from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";
import { ResultType } from "../helpers/types";

export type UserWithCurrencyAndCountry = ResultType<
  "usr",
  { currency: true; country: true }
>;

// GET methods

export async function getUserById(id: number): Promise<Usr | void> {
  return getOneEntityByField("usr", "id", id);
}

export async function getUsersByCountryId(id: number): Promise<Usr[] | void> {
  return getEntitiesByField("usr", "countryId", id);
}

export async function getAllUsers(): Promise<Usr[] | void> {
  return getAllEntity("usr");
}

export async function getUserByEmail(
  email: string,
): Promise<UserWithCurrencyAndCountry | void> {
  return getOneEntityByField("usr", "email", email, {
    currency: true,
    country: true,
  });
}

// POST methods

export async function postUser(
  user: Partial<Omit<Usr, "user_id">>,
): Promise<Usr | void> {
  return postOneEntity("usr", user);
}

// export async function findOrPostUser(user: Partial<Omit<Usr, 'user_id'>>): Promise<Usr | void> {
//     /**
//      * @deprecated Use upsert one by user (not technically the same but close)
//      */
//     const request = await getOneEntityByField('usr', 'email', user.email);
//     if (request) return request
//     return postOneEntity('usr', user);
// }

// DELETE methods

export async function deleteUserById(id: number): Promise<Usr | void> {
  return deleteOneEntityByField("usr", "id", id);
}

// PUT methods

export async function putUserByFields(
  searchFields: FieldValuePair<"usr">,
  putFields: FieldValuePair<"usr">[],
): Promise<Usr | void> {
  return await putOneEntityByField("usr", searchFields, putFields);
}

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
