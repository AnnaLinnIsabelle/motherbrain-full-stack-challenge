import React from "react";
import './CompanyCard.css';

export const CompanyCard = ({org, onOrgSelect, isSelected}) => {
    const {company_name, funding_total_usd, employee_count, city, country_code} = org;
    return (
        <button className='CompanyCardContainer' onClick={() => onOrgSelect(org)} disabled={isSelected}>
            <h3>{company_name}</h3>
            <p><span style={{fontWeight: 'bold'}}>Fundings US$: </span>{funding_total_usd ? funding_total_usd : '0'}</p>
            <p><span style={{fontWeight: 'bold'}}>Employees: </span>{employee_count}</p>
            <p><span style={{fontWeight: 'bold'}}>Location: </span>{`${city}, ${country_code}`}</p>
        </button>
    )
}