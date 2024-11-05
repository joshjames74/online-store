import { Country } from "@prisma/client";

export async function getAllCountries(): Promise<Country[]> {
    const response = await fetch("/api/country/all", {
        method: "GET",
        cache: "force-cache"
    });
    if (!response.ok) {
        throw new Error('Error in fetching all countries');
    };
    return response.json();
}