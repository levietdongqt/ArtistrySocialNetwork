'use client'


import {Bounce, ToastContainer} from "react-toastify";

export default function LoginLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    // var params = usePathname();
    // var isLogin = params.includes("/login")
    return (
        <html lang="en">
        <body>

        {children}

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