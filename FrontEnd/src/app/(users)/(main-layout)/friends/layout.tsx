'use client'
import React from "react";
import { FriendLayout } from '../../_components/layout/common-layout';
import { SEO } from '../../_components/common/seo';
import { MainHeader } from '../../_components/home/main-header';
import { MainContainer } from '../../_components/home/main-container';
import ContainerFriend from "../../_components/container/ContainerFriend";
import {FriendHomeLayout} from "../../_components/friend/friendHomeLayout";
import {useRouter} from "next/navigation";
import {AnimatePresence} from "framer-motion";

export default function FriendsLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const { back } = useRouter();
    return (
        <>
            <FriendLayout>
                <MainContainer>
                    <SEO title='Friends' />
                    <MainHeader useActionButton title='Bạn bè' action={back} />
                    <FriendHomeLayout>
                        <AnimatePresence mode='popLayout'>
                            {children}
                        </AnimatePresence>
                    </FriendHomeLayout>
                </MainContainer>
            </FriendLayout>
        </>

    )
}