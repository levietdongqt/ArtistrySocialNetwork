'use client'
import { motion } from 'framer-motion';
import { useUser } from '../../../../context/user-context';
import { Loading } from '@components/ui/loading';
import { UserNav } from '../user/user-nav';
import { variants } from '../user/user-header';
import type { LayoutProps } from './common-layout';

export function UserFollowLayout({ children }: LayoutProps): JSX.Element {
  const { currentUser: userData  } = useUser();
  const loading = false;
  return (
    <>
      {!userData ? (
        <motion.section {...variants}>
          {loading ? (
            <Loading className='mt-5 w-full' />
          ) : (
            <div className='w-full p-8 text-center'>
              <p className='text-3xl font-bold'>This account doesn’t exist</p>
              <p className='text-light-secondary dark:text-dark-secondary'>
                Try searching for another.
              </p>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          <UserNav follow />
          {children}
        </>
      )}
    </>
  );
}
