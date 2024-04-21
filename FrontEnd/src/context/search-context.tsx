'use client'
import {createContext, useContext, useState} from 'react';


type SearchContext = {
    searchText: any | null;
    setSearchText: (search: any) => void;
};

export const SearchContext = createContext<SearchContext | null>(null);


export function SearchContextProvider({children}: any): JSX.Element {
    const [searchText, setSearchText] = useState<any>(null);
    const values = {
        searchText,
        setSearchText,
    }

    return <SearchContext.Provider value={values}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContext {
    const context = useContext(SearchContext);
    if (!context)
        throw new Error('SearchContext must be used within an UserContextProvider');
    return context;
}
