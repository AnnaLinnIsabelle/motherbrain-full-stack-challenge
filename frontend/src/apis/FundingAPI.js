const baseURL = 'http://localhost:8080/fundings';

export const fetchFundingsByCompanies = async (companyNames) => {
    const url = new URL(`${baseURL}/search-by-company-name`);
    url.searchParams.set("limit", 20);
    url.searchParams.set("offset", 0);
    companyNames.forEach(companyName => url.searchParams.append("company_name", companyName));

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.hits;
    } catch (error) {
        console.log(error);
    }
}