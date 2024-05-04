'use client'
import {createContext, useContext, useState} from 'react';


type UpLoadContext = {
    files: File[];
    setFiles: (updateFunction: (files:File[]) => File[]) => void;
} 

export const UpLoadContext = createContext<UpLoadContext | null>(null);


export function UploadContextProvider({children}: any): JSX.Element {
    const [files, setFiles] = useState<File[]>([]);
    const values = {
        files,
        setFiles,
    }

    return <UpLoadContext.Provider value={values}>{children}</UpLoadContext.Provider>;
}

export function useUpload(): UpLoadContext {
    const context = useContext(UpLoadContext);
    if (!context)
        throw new Error('must be used within an UserContextProvider');
    return context;
}
