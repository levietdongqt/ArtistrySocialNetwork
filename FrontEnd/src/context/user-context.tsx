'use client'
import {createContext, useContext, useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import type {User} from '@models/user';
import {getCookie, setCookie} from "cookies-next";

type UserContextProps = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextProps | null>(null);


export function UserContextProvider({children}: any): JSX.Element {

    const userCookies = getCookie('user')?.toString()
    const user: User = userCookies ? JSON.parse(userCookies) : null;
    const [currentUser, setCurrentUser] = useState<User | null>(user || null);
    const values = {
        currentUser,
        setCurrentUser,
    }
    useEffect(() => {
        console.log("Current User Changed: ",currentUser)
    }, [currentUser]);
    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextProps {
    const context = useContext(UserContext);
    if (!context)
        throw new Error('useUser must be used within an UserContextProvider');
    return context;
}
