import { useState, useEffect } from 'react';
import { getDoc, doc, onSnapshot } from 'firebase/firestore';
import { usersCollection } from '../../firebase/collections';
import type { User } from '../../models/user';

type UseCollection = {
  data: [] | null;
  loading: boolean;
};

type DataWithRef<T> = (T & { createdBy: string })[];
type DataWithUser<T> = UseCollection<T & { user: User }>;

export type UseCollectionOptions = {
  includeUser?: boolean;
  allowNull?: boolean;
  disabled?: boolean;
  preserve?: boolean;
};

export function useCollection<T>(
  options: {
    includeUser: true;
    allowNull?: boolean;
    disabled?: boolean;
    preserve?: boolean;
  }
): DataWithUser<T>;

export function useCollection<T>(
  options?: UseCollectionOptions
): UseCollection<T>;

export function useCollection<T>(
  options?: UseCollectionOptions
): UseCollection<T> | DataWithUser<T> {

  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);


  const { includeUser, allowNull, disabled, preserve } = options ?? {};

  useEffect(() => {
    if (disabled) {
      setLoading(false);
      return;
    }

    if (!preserve && data) {
      setData(null);
      setLoading(true);
    }

    const populateUser = async (currentData: DataWithRef<T>): Promise<void> => {
      const dataWithUser = await Promise.all(
        currentData.map(async (currentData) => {
          const user = (
            await getDoc(doc(usersCollection, currentData.createdBy))
          ).data();
          return { ...currentData, user };
        })
      );
      setData(dataWithUser);
      setLoading(false);
    };

   /* const unsubscribe = onSnapshot(cachedQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) =>
        doc.data({ serverTimestamps: 'estimate' })
      );

      if (allowNull && !data.length) {
        setData(null);
        setLoading(false);
        return;
      }

      if (includeUser) void populateUser(data as DataWithRef<T>);
      else {
        setData(data);
        setLoading(false);
      }
    });*/

    /*return unsubscribe;*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ disabled]);

  return { data, loading };
}
