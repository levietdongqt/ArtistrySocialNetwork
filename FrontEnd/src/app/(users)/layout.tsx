'use client'
import '../styles/globals.scss'
import {AuthContextProvider} from '../../context/auth-context';
import {ThemeContextProvider} from '../../context/theme-context';
import {AppHead} from './_components/common/app-head';
import {MainLayout} from "./_components/layout/main-layout";
import {ProtectedLayout} from "./_components/layout/common-layout";
import {usePathname} from "next/navigation";
import {Bounce, ToastContainer} from "react-toastify";
import {UserContextProvider} from "../../context/user-context";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    // var params = usePathname();
    // var isLogin = params.includes("/login")
    return (
        <html lang="en">
        <AppHead/>
        <body>
        <UserContextProvider>
            <AuthContextProvider>
                <ThemeContextProvider>
                    {/*{*/}
                    {/*    !isLogin ? (*/}
                    {/*        <>*/}
                                {/*<ProtectedLayout>*/}
                                <MainLayout>
                                    {children}
                                </MainLayout>
                                {/*</ProtectedLayout>*/}
                    {/*        </>*/}
                    {/*    ) : (<>{children}</>)*/}
                    {/*}*/}
                </ThemeContextProvider>
            </AuthContextProvider>
        </UserContextProvider>
        <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}/>
        </body>
        </html>
    )
}