/**
 * 
 * Fetch data from a defined url and with cache options. 
 * 
 * @param {string} url - The target url of the requets
 * @param {RequestCache} [cache="force-cache"] - The cache option for the request. Defaults to force-cache for faster loading. Should be set to no-cache for requests that are expected to change. Alternatively, use reload when the data changes to reset the cache.
 * @returns {T} Fetched data from the API
 */

export async function fetchData<T>(
    url: string,
    cache?: RequestCache
): Promise<T> {
    const response = await fetch(url, { method: "GET", cache: cache ? cache : "force-cache" });
    if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`);
    };
    return response.json();
};

