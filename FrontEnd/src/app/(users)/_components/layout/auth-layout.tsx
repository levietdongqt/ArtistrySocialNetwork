import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { sleep } from '@lib/utils';
import { Placeholder } from '../common/placeholder';
import type { LayoutProps } from './common-layout';

export function AuthLayout({ children }: LayoutProps):JSX.Element {
  const [pending, setPending] = useState(true);

  /*const { data, loading } = useAuth();*/
  const loading = false;
  const  user  = [
    {
      id: '1',
      name: 'Sara',
      email: 'sara@me.com',
    },
    {
      id: '2',
      name: 'Sar2a',
      email: 'sara@me.com',
    }
  ]
  const { replace } = useRouter();

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);

      if (user) {
        await sleep(500);
        void replace('/home');
      } else if (!loading) {
        await sleep(500);
        setPending(false);
      }
    };

    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
