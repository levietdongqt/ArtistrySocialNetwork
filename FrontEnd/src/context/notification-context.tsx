'use client'
import { fetcherWithToken } from '@lib/config/SwrFetcherConfig';
import {createContext, useCallback, useContext, useState} from 'react';



type NotificationContext = {
    dataCount: number;
    setDataCount: (updateFunction: (prevDataCount: number) => number) => void;
    notificationsContent: any;
    setNotificationsContent: (updateFunction: (prevDataCount: any) => any) => void;
    updatedNotifications: any[];
    setUpdatedNotifications: (updateFunction: (prevUpdatedNotifications: any[]) => any[]) => void;
    reRenderNotifications:boolean;
    setReRenderNotifications: (updateFunction: (prevRender:boolean) => boolean) => void;
};

export const NotificationContext = createContext<NotificationContext | null>(null);


export function NotificationContextProvider({children}: any): JSX.Element {
    const [dataCount, setDataCount] = useState<number>(0);
    const [notificationsContent,setNotificationsContent] = useState<any>();
    const [updatedNotifications,setUpdatedNotifications] = useState<any>();
    const [reRenderNotifications,setReRenderNotifications] = useState<boolean>(false);
    const values = {
        dataCount,
        setDataCount,
        notificationsContent,
        setNotificationsContent,
        updatedNotifications,
        setUpdatedNotifications,
        reRenderNotifications,
        setReRenderNotifications
    }

    return <NotificationContext.Provider value={values}>{children}</NotificationContext.Provider>;
}

export function useNotification(): NotificationContext {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error('SearchContext must be used within an UserContextProvider');
    return context;
}
