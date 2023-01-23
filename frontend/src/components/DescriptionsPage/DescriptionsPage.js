import React, { useState } from "react";
import { fetchFundingsByCompany } from "../../apis/FundingAPI.js";
import { ScatterPlot } from "../ScatterPlot/ScatterPlot.js";
import './DescriptionPage.css';
import { randomColor } from 'randomcolor';
import { mapToScatterData } from '../../utils';
import { useOrgDescriptionSearch } from "../../hooks/useOrgDescriptionSearch.js";
import { CompanyCard } from "../CompanyCard/CompanyCard.js";


export const DescriptionPage = () => {
    const [selectedOrgsByTerm, setSelectedOrgsByTerm] = useState({});
    const [searchStr, setSearchStr, results, isLoading] = useOrgDescriptionSearch();

    const onOrgSelected = async (org) => {
        const fundings = await fetchFundingsByCompany(org.company_name, org.uuid);
        const descriptionTermEntry = selectedOrgsByTerm[searchStr] || { color: randomColor(), orgs: [] };
        setSelectedOrgsByTerm({
            ...selectedOrgsByTerm,
            [searchStr]: { ...descriptionTermEntry,
                            orgs: [ ...descriptionTermEntry.orgs, { ...org, fundings: fundings } ],
                        }
        });
    }

    return (
        <div className='pageContainer'>
            <section className='scatterPlotSection'>
                <ScatterPlot dataCollections={mapToScatterData(selectedOrgsByTerm)}/>
            </section>
            <section className='searchSection'>
                <label>Find companies with the following word in their description:</label>
                <input type='text' onChange={(e) => setSearchStr(e.target.value)}/>
                <div className='resultCardContainer'>
                    {isLoading && <h3>...Searching</h3>}
                    {!isLoading && results.map(org => <CompanyCard key={org.uuid} org={org} onOrgSelect={() => onOrgSelected(org)} />)}
                </div>
            </section>
            <section className='selectedSection'>
                {Object.entries(selectedOrgsByTerm).map(([descriptionTerm, value]) => (
                    <div key={descriptionTerm} className='selectionBox' style={{borderColor: value.color}}>
                        <h4 style={{color: value.color}}>{descriptionTerm}</h4>
                        {value.orgs.map(org => <div key={org.uuid} className='selectedOrg'><p>{org.company_name}</p><button className='removeButton'>X</button></div>)}
                    </div>
                ))}
            </section>
        </div>
    )
}