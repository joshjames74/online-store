import { Address } from "@prisma/client";
import { deleteOneEntityByField, getAllEntity, getEntitiesByField, getOneEntityByField } from "../helpers/dynamicQuery";


// GET method

export async function getAddressById(id: number): Promise<Address | void> {
    return await getOneEntityByField('address', 'id', id);
}

export async function getAddressesByUserId(id: number): Promise<Address[] | void> {
    return await getEntitiesByField('address', 'usrId', id);
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