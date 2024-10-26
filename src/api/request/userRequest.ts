import { Usr } from "@prisma/client";
import axios from "axios";


// POST methods 

export async function findOrPostUser(user: Partial<Omit<Usr, 'usr_id'>>): Promise<Usr> {
    const request = await axios(`/api/user/by-email`, {
        method: "POST",
        data: user
    });
    return request.data.data;
}