'use client'
import {useRouter} from 'next/navigation';
import {useUser} from '../../../../context/user-context';
import type {LayoutProps} from '../layout/common-layout';
import {BookmarkNav} from "./bookmark-nav";

export function BookmarkLayout({children}: LayoutProps): JSX.Element {
    const {currentUser} = useUser();
    const router = useRouter();

    return (
        <>
            <BookmarkNav/>
            {children}
        </>
    );
}
