import { Country } from "@prisma/client";

export async function getAllCountries(cache?: RequestCache): Promise<Country[]> {
    const response = await fetch("/api/country/all", {
        method: "GET",
        cache: cache ? cache : "force-cache"
    });
    if (!response.ok) {
        throw new Error('Error in fetching all countries');
    };
    return response.json();
}