import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

type UseUser = {
  data: [] | null;
  loading: boolean;
};

type DataWithRef = [];
type DataWithUser = UseUser;

export function UseUser(
    options?: { includeUser?: true; disabled?: boolean }
): DataWithUser;

export function UseUser(
    options?: { includeUser?: false; disabled?: boolean }
): UseUser;

export function UseUser(
    options?: { includeUser?: boolean; disabled?: boolean }
): UseUser | DataWithUser {
  const [data, setData] = useState<[] | null>([]);
  const [loading, setLoading] = useState(true);


  const { includeUser, disabled } = options ?? {};
  const optionss = {
    method: 'GET',
    url: 'https://twitter135.p.rapidapi.com/v1.1/Users/',
    params: {
      usernames: 'BillGates,Google'
    },
    headers: {
      'X-RapidAPI-Key': '35b51aa4a7msh54d90a56186c810p1e2f3ajsn77f941f19aa6',
      'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
    }
  };

  useEffect(() => {
    if (disabled) return;
    if (includeUser && !data) setLoading(true);

    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.request(optionss);
        const fetchedData = response.data;
        if (includeUser) {
          const dataWithUser = fetchedData.map((user: any) => ({
            ...user,
            createdBy: user.id
          }));
          setData(dataWithUser);
        } else {
          // Xử lý dữ liệu khi includeUser là false
          setData(fetchedData);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setData(null);
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return { data, loading };
}
