import React, { useCallback, useEffect, useState } from 'react';
import { searchOrgsByDescription } from '../apis/OrgAPI';

export const useOrgDescriptionSearch = () => {
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
          }, 1300)
      
          return () => clearTimeout(delayDebounceFn)
    }, [searchStr, doSearch]);

    return [searchStr, setSearchStr, results, isLoading];
}