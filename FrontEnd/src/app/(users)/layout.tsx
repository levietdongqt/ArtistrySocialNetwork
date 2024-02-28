'use client'
import '../styles/globals.scss'
import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { AppHead } from './_components/common/app-head';
import {WindowContextProvider} from "@lib/context/window-context";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <AppHead />
        <body>
        <WindowContextProvider>
            {/*<AuthContextProvider>*/}
                {/*<ThemeContextProvider>*/}
                        {children}
                {/*</ThemeContextProvider>*/}
            {/*</AuthContextProvider>*/}
        </WindowContextProvider>
        </body>
        </html>
    )
}