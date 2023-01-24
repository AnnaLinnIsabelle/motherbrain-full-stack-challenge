const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    node: process.env.ES_URL,
});

async function searchFundings(limit = 10, offset = 0) {
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
  
async function searchFundingsByCompanyName(company_names, limit = 10, offset = 0) {
    
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

module.exports = { searchFundings, searchFundingsByCompanyName };