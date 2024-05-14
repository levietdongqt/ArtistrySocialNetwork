'use client'
import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '../user/user-header';
import {FriendNavLink} from "./friendNavLink";

type FriendsNavProps = {
    follow?: boolean;
};

const allNavs = [

    [
        { name: 'Tất cả bạn bè', path: '' },
        { name: 'Lời mời kết bạn', path: 'friendsRequest' },
    ],
    [
        { name: 'Following', path: 'following' },
        { name: 'Followers', path: 'followers' }
    ]
] as const;

export function FriendsNav({ follow }: FriendsNavProps): JSX.Element {
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
                <FriendNavLink name={name} path={path} key={name} />
            ))}
        </motion.nav>
    );
}
