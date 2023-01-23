import React, { useState } from "react";
import { fetchFundingsByCompany } from "../../apis/FundingAPI.js";
import { SearchDescriptionWord } from "../SearchDescriptionWord/SearchDescriptionWord.js.js";
import { ScatterPlot } from "../ScatterPlot/ScatterPlot.js";
import './DescriptionPage.css';
import { randomColor } from 'randomcolor';
import { mapToScatterData } from '../../utils';


export const DescriptionPage = () => {
    const [selectedOrgsByTerm, setSelectedOrgsByTerm] = useState({});

    const onOrgSelected = async (descriptionTerm, org) => {
        const fundings = await fetchFundingsByCompany(org.company_name, org.uuid);
        const descriptionTermEntry = selectedOrgsByTerm[descriptionTerm] || {color: randomColor(), orgs: []};
        setSelectedOrgsByTerm({...selectedOrgsByTerm, [descriptionTerm]: {...descriptionTermEntry, orgs: [...descriptionTermEntry.orgs, {...org, fundings: fundings}]}});
    }

    return (
        <div className='pageContainer'>
            <section className='scatterPlotSection'>
                <ScatterPlot dataCollections={mapToScatterData(selectedOrgsByTerm)}/>
            </section>
            <section className='searchSection'>
                <SearchDescriptionWord onOrgSelect={onOrgSelected}/>
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