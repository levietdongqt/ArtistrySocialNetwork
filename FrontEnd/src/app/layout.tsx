import './styles/globals.scss'
import {Bounce, ToastContainer} from "react-toastify";
import {AppHead} from "./(users)/_components/common/app-head";
import {UserContextProvider} from "../context/user-context";
import {AuthContextProvider} from "../context/auth-context";
import {ThemeContextProvider} from "../context/theme-context";

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
                    {children}
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