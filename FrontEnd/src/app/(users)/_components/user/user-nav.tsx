'use client'
import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '../user/user-header';
import { UserNavLink } from './user-nav-link';

type UserNavProps = {
  follow?: boolean;
};

const allNavs = [

  [
    { name: 'Overview', path: '' },
    { name: 'Review', path: 'review' },
    { name: 'Post', path: 'post' },
    { name: 'Service', path: 'service' },
  ],
  [
    { name: 'Following', path: 'following' },
    { name: 'Followers', path: 'followers' }
  ]
] as const;

export function UserNav({ follow }: UserNavProps): JSX.Element {
  const userNav = allNavs[+!!follow];

  return (
    <motion.nav
      className={cn(
        `hover-animation flex justify-between overflow-y-auto
         border-b border-light-border dark:border-dark-border`,
        follow && 'mt-1 mb-0.5'
      )}
      {...variants}
      exit={undefined}
    >
      {userNav.map(({ name, path }) => (
        <UserNavLink name={name} path={path} key={name} />
      ))}
    </motion.nav>
  );
}
