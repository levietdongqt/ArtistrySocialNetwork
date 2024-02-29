
import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as signOutFirebase
} from 'firebase/auth';
import { auth } from '@lib/firebase/app';
import { getRandomId, getRandomInt } from '@lib/random';
import type { ReactNode } from 'react';

type AuthContext = {
  user: [] | null;
  error: Error | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps) {
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<[] | null>([]);
  const [loading, setLoading] = useState(true);

  /*useEffect(() => {
    const manageUser = async (authUser: AuthUser): Promise<void> => {
      const { uid, displayName, photoURL } = authUser;

      const userSnapshot = await getDoc(doc(usersCollection, uid));

      if (!userSnapshot.exists()) {
        let available = false;
        let randomUsername = '';

        while (!available) {
          const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
          const randomInt = getRandomInt(1, 10_000);

          randomUsername = `${normalizeName as string}${randomInt}`;

          const randomUserSnapshot = await getDoc(
              doc(usersCollection, randomUsername)
          );

          if (!randomUserSnapshot.exists()) available = true;
        }

        const userData: WithFieldValue<User> = {
          id: uid,
          bio: null,
          name: displayName as string,
          theme: null,
          accent: null,
          website: null,
          location: null,
          photoURL: photoURL ?? '/assets/twitter-avatar.jpg',
          username: randomUsername,
          verified: false,
          following: [],
          followers: [],
          createdAt: serverTimestamp(),
          updatedAt: null,
          totalTweets: 0,
          totalPhotos: 0,
          pinnedTweet: null,
          coverPhotoURL: null
        };

        const userStatsData: WithFieldValue<Stats> = {
          likes: [],
          tweets: [],
          updatedAt: null
        };

        try {
          await Promise.all([
            setDoc(doc(usersCollection, uid), userData),
            setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
          ]);

          const newUser = (await getDoc(doc(usersCollection, uid))).data();
          setUser(newUser as User);
        } catch (error) {
          setError(error as Error);
        }
      } else {
        const userData = userSnapshot.data();
        setUser(userData);
      }

      setLoading(false);
    };*/
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      var a = await signInWithPopup(auth, provider);

      console.log(a);
    } catch (error) {
      setError(error as Error);
    }
  };
  setUser([]);
  const signOut = async (): Promise<void> => {
    try {
      await signOutFirebase(auth);
    } catch (error) {
      setError(error as Error);
    }
  };

  const isAdmin = true;
  /*const randomSeed = useMemo(getRandomId, [user?.id]);*/

  const value: AuthContext = {
    user,
    error,
    loading,
    isAdmin,
    signOut,
    signInWithGoogle
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context){
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
}
