import { Usr } from "@prisma/client";
import { getAllEntity, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";


// GET methods

export async function getUserById(id: number): Promise<Usr | void> {
    return getOneEntityByField('usr', 'id', id);
}

export async function getAllUsers(): Promise<Usr[] | void> {
    return getAllEntity('usr');
}


// POST methods

export async function postUser(user: Omit<Usr, 'user_id'>): Promise<Usr | void> {
    return postOneEntity('usr', user);
}