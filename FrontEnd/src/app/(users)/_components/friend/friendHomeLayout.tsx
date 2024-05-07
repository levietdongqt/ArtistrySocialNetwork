'use client'
import {useRouter} from 'next/navigation';
import {useUser} from '../../../../context/user-context';
import {FriendsNav} from '../friend/friend-nav';
import type {LayoutProps} from '../layout/common-layout';

export function FriendHomeLayout({children}: LayoutProps): JSX.Element {
    const {currentUser} = useUser();
    const router = useRouter();

    return (
        <>
            <FriendsNav/>
            {children}
        </>
    );
}
