'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sleep } from '@lib/utils';
import type { LayoutProps } from './common-layout';
import {Placeholder} from "../common/placeholder";
import {useUser} from "../../../../context/user-context";

export function AuthLayout({ children }: LayoutProps): JSX.Element {
  const [pending, setPending] = useState(true);
  const   user   = useUser();
  const { replace } = useRouter();
  console.log("user: " + user)
  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);
      if (!user) {
        await sleep(500);
        void replace('/');
      }
      // else if (!loading) {
      //   await sleep(500);
      //   setPending(false);
      // }
    };

    void checkLogin();
  }, []);
  // console.log(loading,pending)
  // if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
