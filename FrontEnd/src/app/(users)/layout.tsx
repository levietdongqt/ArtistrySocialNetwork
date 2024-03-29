'use client'
import '../styles/globals.scss'
import { AuthContextProvider } from '../../context/auth-context';
import { ThemeContextProvider } from '../../context/theme-context';
import { AppHead } from './_components/common/app-head';
import {MainLayout} from "./_components/layout/main-layout";
import {ProtectedLayout} from "./_components/layout/common-layout";
import { usePathname} from "next/navigation";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    var params = usePathname();
    var isLogin = params.includes("/login")
    return (
        <html lang="en">
        <AppHead />
        <body>
            <AuthContextProvider>
                <ThemeContextProvider>
                    {
                        !isLogin ? (
                            <>
                                <ProtectedLayout>
                                    <MainLayout>
                                        {children}
                                    </MainLayout>
                                </ProtectedLayout>
                            </>
                        ) : (<>{children}</>)
                    }
                </ThemeContextProvider>
            </AuthContextProvider>
        </body>
        </html>
    )
}