const baseURL = 'http://localhost:8080/fundings';

export const fetchFundingsByCompany = async (companyName, uuid) => {
    const url = new URL(`${baseURL}/search-by-company-name`);
    url.searchParams.set("limit", 20);
    url.searchParams.set("offset", 0);
    url.searchParams.set("company_name", companyName);
    url.searchParams.set("company_uuid", uuid);

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.hits;
    } catch (error) {
        console.log(error);
    }
}