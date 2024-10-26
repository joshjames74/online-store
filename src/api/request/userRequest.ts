import { Usr } from "@prisma/client";
import axios from "axios";


// POST methods 

export async function findOrPostUser(user: Partial<Omit<Usr, 'usr_id'>>): Promise<Usr> {
    const response = await fetch(`/api/user/by-email`, {
        method: "POST",
        body: JSON.stringify(user),
        cache: "force-cache"
    });
    if (!response) {
        throw new Error('Error in find or post user');
    }
    return response.json();
}