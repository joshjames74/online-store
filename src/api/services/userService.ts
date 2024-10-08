import { Usr } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByField, getOneEntityByField, postOneEntity, putOneEntityByField } from "../helpers/dynamicQuery";
import { FieldValuePair } from "../helpers/request";


// GET methods

export async function getUserById(id: number): Promise<Usr | void> {
    return getOneEntityByField('usr', 'id', id);
}

export async function getUsersByCountryId(id: number): Promise<Usr | void> {
    return getEntitiesByField('usr', 'countryId', id);
}

export async function getAllUsers(): Promise<Usr[] | void> {
    return getAllEntity('usr');
}


// POST methods

export async function postUser(user: Omit<Usr, 'user_id'>): Promise<Usr | void> {
    return postOneEntity('usr', user);
}


// DELETE methods

export async function deleteUserById(id: number): Promise<Usr | void> {
    return deleteOneEntityByField('usr', 'id', id);
};


// PUT methods

export async function putUserByFields(searchFields: FieldValuePair<'usr'>, putFields: FieldValuePair<'usr'>[]): Promise<Usr | void> {
    return await putOneEntityByField('usr', searchFields, putFields);
}