import { Address } from "@prisma/client";
import axios from "axios";

export async function getAddressesByUserId(id: number): Promise<Address[]> {
    const request = await axios(`/api/user/${id}/addresses`, { method: "GET" });
    return request.data;
};