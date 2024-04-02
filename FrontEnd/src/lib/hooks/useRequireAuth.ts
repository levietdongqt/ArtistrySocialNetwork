'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useAuth} from "../../context/auth-context";


export function useRequireAuth(redirectUrl?: string) {
  const { user , loading } = useAuth();
  const { replace } = useRouter();
  useEffect(() => {
    if (!loading && !user) void replace(redirectUrl ?? '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return user;
}
