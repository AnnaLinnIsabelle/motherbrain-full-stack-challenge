const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    node: process.env.ES_URL,
});

async function searchOrgs(limit = 10, offset = 0) {  
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

async function searchOrgsByDescription(searchTerm, limit = 10, offset = 0) {
  
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

  module.exports = {searchOrgs, searchOrgsByDescription};