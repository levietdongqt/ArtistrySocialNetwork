'use client'
import React from "react";
import {FriendLayout, HomeLayout} from '../../_components/layout/common-layout';
import { SEO } from '../../_components/common/seo';
import { MainHeader } from '../../_components/home/main-header';
import { MainContainer } from '../../_components/home/main-container';
import {FriendHomeLayout} from "../../_components/friend/friendHomeLayout";
import {useRouter} from "next/navigation";
import {BookmarkLayout} from "../../_components/bookmark/BookMarkLayout";

export default function FriendsLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const { back } = useRouter();
    return (
        <>
            <HomeLayout>
                <MainContainer>
                    <SEO title='Bookmarks' />
                    <MainHeader useActionButton title='Đã lưu' action={back} />
                    <BookmarkLayout>
                        {children}
                    </BookmarkLayout>
                </MainContainer>
            </HomeLayout>
        </>

    )
}