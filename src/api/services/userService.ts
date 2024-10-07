import { User } from "@prisma/client";
import { getAllEntity, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";


// GET methods

export async function getUserById(id: number): Promise<User | void> {
    return getOneEntityByField('user', 'id', id);
}

export async function getAllUsers(): Promise<User[] | void> {
    return getAllEntity('user');
}


// POST methods

export async function postUser(user: Omit<User, 'user_id'>): Promise<User | void> {
    return postOneEntity('user', user);
}