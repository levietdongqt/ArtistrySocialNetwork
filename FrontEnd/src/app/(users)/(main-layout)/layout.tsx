import {AuthContextProvider} from '../../../context/oauth2-context';
import {ThemeContextProvider} from '../../../context/theme-context';
import {AppHead} from '../_components/common/app-head';
import {MainLayout} from "../_components/layout/main-layout";
import {ProtectedLayout} from "../_components/layout/common-layout";
import {usePathname} from "next/navigation";
import {Bounce, ToastContainer} from "react-toastify";
import {UserContextProvider} from "../../../context/user-context";
import {Placeholder} from "../_components/common/placeholder";
import React, {Suspense} from "react";
import {ChatAlert} from "@components/chat-box/chat-alert";
import {Conversations} from "@components/chat-box/conversations";
import {ACTION_TYPE, ChatAction} from "@lib/reducer/chat-reducer";
import {useChat} from "../../../context/chat-context";

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