import React from "react";
import {MainLayout} from "../../_components/layout/main-layout";
import {ChatAlert} from "@components/chat-box/chat-alert";
import {UserLayout} from "../../_components/layout/common-layout";
import {UserDataLayout} from "../../_components/layout/user-data-layout";
import {UserHomeLayout} from "../../_components/layout/user-home-layout";
import ContainerUser from "../../_components/container/ContainerUser";

export default function ProfileLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return (
        <>
            <UserLayout>
                <UserDataLayout>
                        {children}
                </UserDataLayout>
            </UserLayout>
        </>

    )
}