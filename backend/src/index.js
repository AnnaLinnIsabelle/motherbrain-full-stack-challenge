require("dotenv").config();
const http = require("http");
const { URL } = require("url");
const { searchOrgs, searchOrgsByDescription } = require("./orgService");
const { searchFundings, searchFundingsByCompanyName } = require("./fundingService");


http.createServer(handle).listen(8080);

async function handle(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url = new URL(`http://incoming${req.url}`);
    switch (`${req.method} ${url.pathname}`) {
      case "GET /orgs":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await handleGetOrgsRequest(url.searchParams),
          })
        );
        break;

      case "GET /orgs/search-by-description":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await handleSearchOrgsByDescriptionRequest(url.searchParams),
          })
        );
        break;

      case "GET /fundings":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await handleGetFundingsRequest(url.searchParams),
          })
        );
        break;

      case "GET /fundings/search-by-company-name":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await handleSearchFundingsByCompanyRequest(url.searchParams),
          })
        );
        break;

      default:
        res.writeHead(404).end(
          JSON.stringify({
            message: "Not Found",
          })
        );
        break;
    }
  } catch (e) {
    console.error(e.stack);
    res.writeHead(500).end(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
}

async function handleGetOrgsRequest(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  results = await searchOrgs(limit, offset);
  return results;
}

async function handleSearchOrgsByDescriptionRequest(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");
  const searchTerm = queryParams.get("searchTerm");

  results = await searchOrgsByDescription(searchTerm, limit, offset);
  return results;
}

async function handleGetFundingsRequest(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  results = await searchFundings(limit, offset);
  return results;
}

async function handleSearchFundingsByCompanyRequest(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");
  const company_names = queryParams.getAll("company_name");

  results = await searchFundingsByCompanyName(company_names, limit, offset);
  return results;
}
