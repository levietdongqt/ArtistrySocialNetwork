'use client'
import '../styles/globals.scss'
import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { AppHead } from './_components/common/app-head';
import {WindowContextProvider} from "@lib/context/window-context";
import {MainLayout} from "./_components/layout/main-layout";
import {ProtectedLayout} from "./_components/layout/common-layout";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <AppHead />
        <body>
            <ProtectedLayout>
                <MainLayout>
                    {/*<AuthContextProvider>*/}
                        {/*<ThemeContextProvider>*/}
                                {children}
                        {/*</ThemeContextProvider>*/}
                    {/*</AuthContextProvider>*/}
                </MainLayout>
              </ProtectedLayout>
        </body>
        </html>
    )
}