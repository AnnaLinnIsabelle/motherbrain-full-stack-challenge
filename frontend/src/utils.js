/* Math utils **/

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;


/* Chart utils **/

const getAvgEmployees = (employeeCount) => {
    return Math.round(average(employeeCount.split('-').map(numStr => parseInt(numStr))));
}

const mapOrgToScatterData = (org) => ({
    ...org,
    funding_rounds: parseInt(org.funding_rounds),
    funding_total_usd: parseInt(org.funding_total_usd),
    employees: org.employee_count ? getAvgEmployees(org.employee_count) : 0,
});

export const mapToScatterData = (orgsByTerm) => {
    return Object.entries(orgsByTerm).map(([term, value]) => {
        return({term: term, color: value.color, orgs: value.orgs.map(org => mapOrgToScatterData(org))})
    });
}

export const mapFundingsToLineData = (fundings) => {
    const groupedByDate = fundings.reduce((accumulated, currentFunding) => {
        accumulated[currentFunding.announced_on] = [...(accumulated[currentFunding.announced_on] || []), currentFunding];
        return accumulated;
    }, {});

    return Object.entries(groupedByDate).map(([announced_on, _fundings]) => {
        let dataPoint = {announced_on: announced_on};
        _fundings.forEach(funding => dataPoint[funding.company_name] = funding.raised_amount_usd);
        return dataPoint;
    })
}