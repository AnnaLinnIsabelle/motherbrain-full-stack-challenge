import React, { useState } from "react";
import { fetchFundingsByCompanies } from "../../apis/FundingAPI.js";
import { ScatterPlot } from "../ScatterPlot/ScatterPlot.js";
import './DescriptionPage.css';
import { randomColor } from 'randomcolor';
import { mapFundingsToLineData, mapToScatterData } from '../../utils';
import { useOrgDescriptionSearch } from "../../hooks/useOrgDescriptionSearch.js";
import { CompanyCard } from "../CompanyCard/CompanyCard.js";
import { LineChartComponent } from "../LineChart/LineChart.js";


export const DescriptionPage = () => {
    const [selectedOrgsByTerm, setSelectedOrgsByTerm] = useState({});
    const [searchStr, setSearchStr, results, isLoading] = useOrgDescriptionSearch();
    const [lineChartData, setLineChartData] = useState({dataLines: [], dataSet: []});

    const onOrgSelected = async (org) => {
        const allCompanyNames = [ ...flattenSelectedCompanyNames(), org.company_name];
        const allFundings = await fetchFundingsByCompanies(allCompanyNames);
        const descriptionTermEntry = selectedOrgsByTerm[searchStr] || { color: randomColor(), orgs: [] };
        const updatedSelections = {
            ...selectedOrgsByTerm,
            [searchStr]: { ...descriptionTermEntry,
                            orgs: [ ...descriptionTermEntry.orgs, { ...org, fundings: allFundings.filter(funding => funding.company_uuid === org.uuid) } ],
                        }
        }
        setSelectedOrgsByTerm(updatedSelections);
        setLineChartData({
            dataLines: [...lineChartData.dataLines, {key: org.company_name, color: randomColor()}],
            dataSet: mapFundingsToLineData(allFundings),
        });
    }

    const flattenSelectedCompanyNames = () => Object.values(selectedOrgsByTerm).flatMap(value => value.orgs).map(org => org.company_name);

    const isOrgSelected = (uuid) => {
        return selectedOrgsByTerm[searchStr]?.orgs.find(org => org.uuid === uuid);
    }

    const removeSelectedOrg = async (descriptionTerm, uuid, company_name) => {
        const updatedOrgs = selectedOrgsByTerm[descriptionTerm].orgs.filter(org => org.uuid !== uuid);
        if (!updatedOrgs.length) {
            const selectedOrgsByTermCopy = {...selectedOrgsByTerm};
            const updatedSelectedOrgsByTerm = delete selectedOrgsByTermCopy[descriptionTerm];
            setSelectedOrgsByTerm(updatedSelectedOrgsByTerm);
        } else {
            setSelectedOrgsByTerm({
                ...selectedOrgsByTerm,
                [descriptionTerm]: {
                    ...selectedOrgsByTerm[descriptionTerm],
                    orgs: updatedOrgs,
                }
            });
        }
        const allCompanyNames = flattenSelectedCompanyNames().filter(name => name !== company_name);
        const allFundings = await fetchFundingsByCompanies(allCompanyNames);
        setLineChartData({
            dataLines: lineChartData.dataLines.filter(line => line.key !== company_name),
            dataSet: mapFundingsToLineData(allFundings),
        });
    }

    return (
        <div className='pageContainer'>
            <section className='scatterPlotSection'>
                <ScatterPlot dataCollections={mapToScatterData(selectedOrgsByTerm)}/>
            </section>
            <section className='lineChartSection'>
                <LineChartComponent dataSet={lineChartData.dataSet} dataLines={lineChartData.dataLines}/>
            </section>
            <section className='searchSection'>
                <div className='searchInputContainer'>
                    <label>Find companies with the following word in their description:</label>
                    <input className='searchInput' type='text' onChange={(e) => setSearchStr(e.target.value)}/>
                </div>
                <div className='resultCardContainer'>
                    {isLoading && <h3>...Searching</h3>}
                    {!isLoading && results.map(org => <CompanyCard key={org.uuid} org={org} onOrgSelect={() => onOrgSelected(org)} isSelected={isOrgSelected(org.uuid)}/>)}
                </div>
            </section>
            <section className='selectedSection'>
                {Object.entries(selectedOrgsByTerm).map(([descriptionTerm, value]) => (
                    <div key={descriptionTerm} className='selectionBox' style={{borderColor: value.color}}>
                        <h4 style={{color: value.color}}>{descriptionTerm}</h4>
                        {value.orgs.map(org => <div key={org.uuid} className='selectedOrg'><p>{org.company_name}</p><button className='removeButton' onClick={() => removeSelectedOrg(descriptionTerm, org.uuid, org.company_name)}>X</button></div>)}
                    </div>
                ))}
            </section>
        </div>
    )
}