import { Address } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByField, getOneEntityByField, postOneEntity } from "../helpers/dynamicQuery";
import { ResultType } from "../helpers/types";


// GET method

export async function getAddressById(id: number): Promise<Address | void> {
    return await getOneEntityByField('address', 'id', id);
}

export async function getAddressesByUserId(id: number): Promise<ResultType<"address", { country: true }>[] | void> {
    return await getEntitiesByField('address', 'usrId', id, { country: true});
}

export async function getAddressesByCountryId(id: number): Promise<Address[] | void> {
    return await getEntitiesByField('address', 'countryId', id);
}

export async function getAllAddresses(): Promise<Address[] | void> {
    return await getAllEntity('address');
}


// DELETE methods

export async function deleteAddressById(id: number): Promise<Address | void> {
    return await deleteOneEntityByField('address', 'id', id);
}


// POST methods

export async function postAddress(address: Omit<Address, 'id'>): Promise<Address | void> {
    return await postOneEntity('address', address);
}