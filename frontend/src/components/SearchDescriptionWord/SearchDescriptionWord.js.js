import React, { useCallback, useEffect, useState } from 'react';
import { searchOrgsByDescription } from '../../apis/OrgAPI';
import { CompanyCard } from '../CompanyCard/CompanyCard';
import './SearchDescriptionWord.css';

export const SearchDescriptionWord = ({onOrgSelect}) => {
    const [searchStr, setSearchStr] = useState(null);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const doSearch = useCallback(async (searchTerm) => {
        setIsLoading(true);
        const orgs = await searchOrgsByDescription(searchTerm);
        setResults(orgs);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchStr) doSearch(searchStr);
          }, 3000)
      
          return () => clearTimeout(delayDebounceFn)
    }, [searchStr, doSearch]);

    const onOrgSelected = (org) => onOrgSelect(searchStr, org);


    return (
        <>
            <label>Find companies with the following word in their description:</label>
            <input type='text' onChange={(e) => setSearchStr(e.target.value)}/>
            {isLoading && <p>Loading...</p>}
            <div className='ResultCardContainer'>
                {results.map(result => <CompanyCard key={result.uuid} org={result} onOrgSelect={onOrgSelected} />)}
            </div>
        </>
    )
}