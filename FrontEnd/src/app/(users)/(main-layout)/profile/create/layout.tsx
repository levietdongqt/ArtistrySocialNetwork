import React from "react";
import {MainLayout} from "../../../_components/layout/main-layout";
import {ChatAlert} from "@components/chat-box/chat-alert";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
  
                {children}
        </>
    )
}