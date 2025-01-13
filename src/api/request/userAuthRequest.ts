import { UsrAuth } from "@prisma/client";
import { fetchData } from ".";

export async function getUserAuthBySub(sub: string): Promise<UsrAuth> {
  return fetchData(`/api/userAuth/by-sub/${sub}`, "no-cache");
}

export async function getUserAuthById(id: string): Promise<UsrAuth> {
  return fetchData(`/api/userAuth/${id}`, "no-cache");
}
