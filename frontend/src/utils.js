/* Math utils **/

export const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;


/* Scatter plot utils **/

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