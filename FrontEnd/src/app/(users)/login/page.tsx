import {LoginMain} from './_components/login-main';
import {getCookie} from "cookies-next";
import {cookies} from "next/headers";
import LoginValidation from "@lib/validations/LoginValidation";
import {ReactElement} from "react";
import {SEO} from "../../_components/common/seo";
import {AuthLayout} from "../../_components/layout/auth-layout";

export default async function Login() {
    const prevPage = getCookie("prev_page", {cookies})?.toString();
    console.log("prevPageSSR: " + prevPage)
    return (
            <AuthLayout>
                <div className='grid min-h-screen grid-rows-[1fr,auto]'>
                    <SEO
                        title='Social'
                        description='Login'
                    />
                    <LoginMain/>
                    {/* <LoginFooter /> */}
                </div>
            </AuthLayout>
    );
}


