'use client'
import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '../user/user-header';
import {BookmarkNavLink} from "./bookmarkNavLink";

type FriendsNavProps = {
    follow?: boolean;
};

const allNavs = [

    [
        { name: 'Bài viết đã lưu', path: '' },
        { name: 'Dịch vụ đã lưu', path: 'services' },
    ],
    [
        { name: 'Following', path: 'following' },
        { name: 'Followers', path: 'followers' }
    ]
] as const;

export function BookmarkNav({ follow }: FriendsNavProps): JSX.Element {
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
                <BookmarkNavLink name={name} path={path} key={name} />
            ))}
        </motion.nav>
    );
}
