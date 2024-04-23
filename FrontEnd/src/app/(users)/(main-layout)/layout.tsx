import {MainLayout} from "../_components/layout/main-layout";
import React, {Suspense} from "react";
import {ChatAlert} from "@components/chat-box/chat-alert";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
            <MainLayout >
                {children}
            </MainLayout>
            <ChatAlert/>
        </>

    )
}