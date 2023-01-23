const baseURL = 'http://localhost:8080/orgs';

export const searchOrgsByDescription = async (searchTerm) => {
    const url = new URL(`${baseURL}/search-by-description`);
    url.searchParams.set("limit", 10);
    url.searchParams.set("offset", 0);
    url.searchParams.set("searchTerm", searchTerm);

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.hits;
    } catch (error) {
        console.log(error);
    }
}