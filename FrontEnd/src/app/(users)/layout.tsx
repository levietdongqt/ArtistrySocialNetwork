'use client'
import '../styles/globals.scss'
import { AuthContextProvider } from '../../context/auth-context';
import { ThemeContextProvider } from '../../context/theme-context';
import { AppHead } from './_components/common/app-head';
import {WindowContextProvider} from "../../context/window-context";
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