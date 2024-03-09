
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UseUser } from '@lib/hooks/useUser';


export function useRequireAuth(redirectUrl?: string) {
  const { data , loading } = UseUser();
  const { replace } = useRouter();

  useEffect(() => {
    if (!loading && !data) void replace(redirectUrl ?? '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  return data;
}
