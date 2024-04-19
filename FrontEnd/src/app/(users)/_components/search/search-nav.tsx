'use client'
import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '../user/user-header';
import {SearchNavLink} from "./search-nav-link";

type UserNavProps = {
  follow?: boolean;
};

const allNavs = [
  [
    { name: 'Tất cả', path: 'with_replies' },
    { name: 'Người dùng', path: 'with_replies' },
    { name: 'Dịch vụ', path: 'media' },
    { name: 'Bài đăng', path: 'likes' }
  ],
  [
    { name: 'Following', path: 'following' },
    { name: 'Followers', path: 'followers' }
  ]
] as const;

export function SearchNav({ follow }: UserNavProps): JSX.Element {
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
        <SearchNavLink name={name} path={path} key={name} />
      ))}
    </motion.nav>
  );
}
