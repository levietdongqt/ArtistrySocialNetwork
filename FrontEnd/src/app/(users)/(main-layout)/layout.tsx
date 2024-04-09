import {AuthContextProvider} from '../../../context/auth-context';
import {ThemeContextProvider} from '../../../context/theme-context';
import {AppHead} from '../_components/common/app-head';
import {MainLayout} from "../_components/layout/main-layout";
import {ProtectedLayout} from "../_components/layout/common-layout";
import {usePathname} from "next/navigation";
import {Bounce, ToastContainer} from "react-toastify";
import {UserContextProvider} from "../../../context/user-context";
import {Placeholder} from "../_components/common/placeholder";
import {Suspense} from "react";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    // var params = usePathname();
    // var isLogin = params.includes("/login")
    return (
        <>
            <MainLayout >
                {children}
            </MainLayout>
        </>

    )
}