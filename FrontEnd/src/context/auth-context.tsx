'use client'
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut as signOutFirebase
} from 'firebase/auth';
import {useState, useEffect, useContext, createContext, useMemo} from 'react';
import {auth} from '../firebase/app';
import {getRandomId, getRandomInt} from '@lib/random';
import type {ReactNode} from 'react';
import type {User as AuthUser} from 'firebase/auth';
import type {User} from '@models/user';
import {oauth2Service} from "../services/main/auth-service";
import {getCookie, setCookie} from "cookies-next";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {useRouter} from "next/navigation";

type AuthContext = {
    user: User | null;
    error: Error | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};
export const AuthContext = createContext<AuthContext | null>(null);

export function AuthContextProvider({ children }: AuthContextProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const userDataCookie = getCookie("users");
    useEffect(() => {
        console.log("AuthContextProvider is running: " + userDataCookie)
        const manageUser = (): void => {
            try {
                if (userDataCookie) {
                    setUser(JSON.parse(userDataCookie));
                } else {
                    setUser(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Đã xảy ra lỗi khi xử lý cookie:", error);
                setError(error as Error);
                setLoading(false);
            }
        };
        manageUser();
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            console.log("LOGIN GOOGLE: ", credential)
            const oauth2Response = await oauth2Service(await credential.user.getIdToken())
            handleSuccessResponse(oauth2Response, router)
        } catch (error) {
            setError(error as Error);
        }
    };

    const signInWithFacebook = async (): Promise<void> => {
        try {
            const provider = new FacebookAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            console.log("LOGIN FACEBOOK: ")
            const oauth2Response = await oauth2Service(await credential.user.getIdToken())
            handleSuccessResponse(oauth2Response, router)
        } catch (error) {
            console.log(error)
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await signOutFirebase(auth);
        } catch (error) {
            setError(error as Error);
        }
    };

    const isAdmin = false;
    const randomSeed = useMemo(getRandomId, [1, 2]);

    const value: AuthContext = {
        user,
        error,
        loading,
        isAdmin,
        signInWithGoogle,
        signOut,
        signInWithFacebook
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthContextProvider');
    return context;
}

async function handleSuccessResponse(oauth2Response: any, router: any) {
    setCookieHandler(oauth2Response.data)
    console.log("LOGIN GOOGLE SUCCESSFUL: ")
    const prevPage = getCookie("prev_page")?.toString();
    prevPage ? router.push(prevPage) : router.push("/")
}
