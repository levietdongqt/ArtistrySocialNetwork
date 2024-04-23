'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sleep } from '@lib/utils';
import type { LayoutProps } from './common-layout';
import {Placeholder} from "../common/placeholder";
import {useUser} from "../../../../context/user-context";

export function AuthLayout({ children }: LayoutProps): JSX.Element {
  const [pending, setPending] = useState(true);
  const [loading, setLoading] = useState(false);
  const   {currentUser}   = useUser();
  const { replace } = useRouter();
  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);
      if (currentUser) {
        setLoading(true);
        await sleep(500);
        void replace('/home');
      }
      else if (!loading) {
        await sleep(500);
        setPending(false);
      }
    };

    void checkLogin();
  }, [currentUser,loading]);
  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
