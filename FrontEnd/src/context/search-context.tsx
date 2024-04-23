'use client'
import {createContext, useContext, useState} from 'react';


type SearchContext = {
    searchText: any | null;
    setSearchText: (search: any) => void;
    searchArrayUserIds: any[];
    setSearchArrayUserIds: (updateFunction: (prevSearch:any[]) => any[]) => void;
    searchArrayServiceIds: any[];
    setSearchArrayServiceIds: (updateFunction: (prevSearch:any[]) => any[]) => void;
    searchArrayPostIds: any[];
    setSearchArrayPostIds: (updateFunction: (prevSearch:any[]) => any[]) => void;
    topSearch :string;
    setTopSearch: (updateFunction: (prevSearch:string) => string) => void;
};

export const SearchContext = createContext<SearchContext | null>(null);


export function SearchContextProvider({children}: any): JSX.Element {
    const [searchText, setSearchText] = useState<any>(null);
    const [searchArrayUserIds,setSearchArrayUserIds] = useState<any[]>([]);
    const [searchArrayServiceIds,setSearchArrayServiceIds] = useState<any[]>([]);
    const [searchArrayPostIds,setSearchArrayPostIds] = useState<any[]>([]);
    const [topSearch,setTopSearch] = useState<string>("");
    const values = {
        searchText,
        setSearchText,
        searchArrayUserIds,
        setSearchArrayUserIds,
        searchArrayServiceIds,
        setSearchArrayServiceIds,
        searchArrayPostIds,
        setSearchArrayPostIds,
        topSearch,
        setTopSearch,
    }

    return <SearchContext.Provider value={values}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContext {
    const context = useContext(SearchContext);
    if (!context)
        throw new Error('SearchContext must be used within an UserContextProvider');
    return context;
}
