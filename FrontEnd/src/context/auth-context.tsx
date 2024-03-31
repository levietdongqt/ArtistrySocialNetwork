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
import {setCookie} from "cookies-next";

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

export function AuthContextProvider({
                                        children
                                    }: AuthContextProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(false);
        }
        //   const manageUser = async (authUser: AuthUser): Promise<void> => {
        //     const { uid, displayName, photoURL } = authUser;
        //
        //     const userSnapshot = await getDoc(doc(usersCollection, uid));
        //
        //     if (!userSnapshot.exists()) {
        //       let available = false;
        //       let randomUsername = '';
        //
        //       while (!available) {
        //         const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
        //         const randomInt = getRandomInt(1, 10_000);
        //
        //         randomUsername = `${normalizeName as string}${randomInt}`;
        //
        //         const randomUserSnapshot = await getDoc(
        //             doc(usersCollection, randomUsername)
        //         );
        //
        //         if (!randomUserSnapshot.exists()) available = true;
        //       }
        //
        //       const userData: WithFieldValue<User> = {
        //         id: uid,
        //         bio: null,
        //         name: displayName as string,
        //         theme: null,
        //         accent: null,
        //         website: null,
        //         location: null,
        //         photoURL: photoURL ?? '/assets/twitter-avatar.jpg',
        //         username: randomUsername,
        //         verified: false,
        //         following: [],
        //         followers: [],
        //         createdAt: serverTimestamp(),
        //         updatedAt: null,
        //         totalTweets: 0,
        //         totalPhotos: 0,
        //         pinnedTweet: null,
        //         coverPhotoURL: null
        //       };
        //
        //       const userStatsData: WithFieldValue<Stats> = {
        //         likes: [],
        //         tweets: [],
        //         updatedAt: null
        //       };
        //       console.log("hahaha",userStatsData);
        //       try {
        //         await Promise.all([
        //           setDoc(doc(usersCollection, uid), userData),
        //           setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
        //         ]);
        //
        //         const newUser = (await getDoc(doc(usersCollection, uid))).data();
        //         setUser(newUser as User);
        //       } catch (error) {
        //         setError(error as Error);
        //       }
        //     } else {
        //       const userData = userSnapshot.data();
        //       setUser(userData);
        //     }
        //
        //     setLoading(false);
        //   };
        //
        //   const handleUserAuth = (authUser: AuthUser | null): void => {
        //     setLoading(true);
        //
        //     if (authUser) void manageUser(authUser);
        //     else {
        //       setUser(null);
        //       setLoading(false);
        //     }
        //   };
        //
        //   onAuthStateChanged(auth, handleUserAuth);
        fetchUserData();
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            console.log("LOGIN GOOGLE: ", credential)
            const oauth2Response = await oauth2Service(await credential.user.getIdToken())
            setCookie("access_token", oauth2Response.data.accessToken);
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
            setCookie("access_token", oauth2Response.data.accessToken);
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
