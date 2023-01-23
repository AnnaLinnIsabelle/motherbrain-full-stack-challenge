require("dotenv").config();
const http = require("http");
const { URL } = require("url");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ES_URL,
});


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
            results: await searchOrgs(url.searchParams),
          })
        );
        break;

      case "GET /orgs/search-by-description":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchOrgsByDescription(url.searchParams),
          })
        );
        break;

      case "GET /fundings":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchFundings(url.searchParams),
          })
        );
        break;

      case "GET /fundings/search-by-company-name":
        res.writeHead(200).end(
          JSON.stringify({
            message: "OK",
            results: await searchFundingsByCompanyName(url.searchParams),
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

async function searchOrgs(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  const response = await client.search({
    index: "org",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
      sort: {
        funding_total_usd: { order: 'desc'}
      }
    },
  });

  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}

async function searchOrgsByDescription(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");
  const searchTerm = queryParams.get("searchTerm");

  const response = await client.search({
    index: "org",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
      sort: {
        funding_total_usd: { order: 'desc'}
      },
      query: {
        match_phrase: {
          description: searchTerm
        }
      }
    },
  });

  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}

async function searchFundings(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");

  const response = await client.search({
    index: "funding",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
    },
  });

  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}

async function searchFundingsByCompanyName(queryParams) {
  const limit = queryParams.get("limit");
  const offset = queryParams.get("offset");
  const company_names = queryParams.getAll("company_name");
  
  const response = await client.search({
    index: "funding",
    body: {
      size: limit != null ? limit : 10,
      from: offset != null ? offset : 0,
      sort: {
        announced_on: { order: 'asc'}
      },
      query: {
        bool: {
          should: [
            company_names.map(company_name => ({
              match_phrase: {
                company_name: company_name
              }
            }))
          ]
        }
      }
    },
  });


  return {
    hits: response.body.hits.hits.map((h) => h._source),
    total: response.body.hits.total.value,
  };
}
