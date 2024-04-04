'use client'
import {createContext, useContext, useState} from 'react';
import type {ReactNode} from 'react';
import type {User} from '@models/user';
import {getCookie} from "cookies-next";

type UserContext = {
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
};

export const UserContext = createContext<UserContext | null>(null);


export function UserContextProvider({children}: any): JSX.Element {
    const userCookies = getCookie('user')?.toString()
    const user: User = userCookies ? JSON.parse(userCookies) : null;
    const [currentUser, setCurrentUser] = useState(user);
    const values = {
        currentUser,
        setCurrentUser,
    }
    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export function useUser(): UserContext {
    const context = useContext(UserContext);
    if (!context)
        throw new Error('useUser must be used within an UserContextProvider');
    return context;
}
