import { UsrAuth } from "@prisma/client";
import prisma from "@/lib/prisma";


export async function getUserAuthBySub(sub: string): Promise<UsrAuth | null> {
    return await prisma.usrAuth.findFirst({ where: { sub: sub }});
}

export async function getUserAuthById(id: string): Promise<UsrAuth | null> {
    return await prisma.usrAuth.findFirst({ where: { id: id }});
};
