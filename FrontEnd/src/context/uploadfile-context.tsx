'use client'
import {createContext, useContext, useState} from 'react';


type UpLoadContext = {
    files: File[];
    setFiles: (updateFunction: (files:File[]) => File[]) => void;
    urlUpload: any[];
    setUrlUpload: (updateFunction: (files:any[]) => any[]) => void;
} 

export const UpLoadContext = createContext<UpLoadContext | null>(null);


export function UploadContextProvider({children}: any): JSX.Element {
    const [files, setFiles] = useState<File[]>([]);
    const [urlUpload, setUrlUpload] = useState<any[]>([]);
    const values = {
        files,
        setFiles,
        urlUpload,
        setUrlUpload
    }

    return <UpLoadContext.Provider value={values}>{children}</UpLoadContext.Provider>;
}

export function useUpload(): UpLoadContext {
    const context = useContext(UpLoadContext);
    if (!context)
        throw new Error('must be used within an UserContextProvider');
    return context;
}
