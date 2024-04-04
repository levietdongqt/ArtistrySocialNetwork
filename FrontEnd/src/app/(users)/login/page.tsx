import {LoginMain} from './_components/login-main';
import {getCookie} from "cookies-next";
import {cookies} from "next/headers";
import LoginValidation from "@lib/validations/LoginValidation";
import {ReactElement} from "react";
import {AuthLayout} from '../_components/layout/auth-layout';
import {SEO} from '../_components/common/seo';
import { redirect } from 'next/navigation'


export default async function Login() {
    return (
        // <AuthLayout>
            <div className='grid min-h-screen grid-rows-[1fr,auto]'>
                <SEO
                    title='Social'
                    description='Login'
                />
                <LoginMain/>
                {/* <LoginFooter /> */}
            </div>
        // </AuthLayout>
    );
}


