import {useUser} from "../../../context/user-context";
import {redirect, useRouter} from "next/navigation";
import {cookies} from "next/headers";
import {getCookie} from "cookies-next";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const user = getCookie("user",{cookies})
    if(user) {
        redirect("/home")
    }
    return (
        <>

            <main>
                <section className="relative w-full h-full py-40 min-h-screen">
                    <div
                        className="absolute top-0 w-full h-full bg-slate-800 bg-no-repeat bg-full"
                        style={{
                            backgroundImage: "url('/image/register_bg_2.png')",
                        }}
                    ></div>
                    <div className="container  mx-auto px-4 h-full">
                        <div className="flex content-center items-center justify-center h-full">
                            <div className="w-full lg:w-6/12 sm:w-6/12 2xl:w-5/12  px-4">
                                <div
                                    className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
