import {AuthLayout} from '../_components/layout/auth-layout';
import {SEO} from '../_components/common/seo';
import {LoginMain} from './_components/login-main';
import {getCookie} from "cookies-next";
import {cookies} from "next/headers";

export default function Login(): JSX.Element {
    const prevPage = getCookie("prev_page", {cookies})?.toString();
    console.log("prevPage: " + prevPage)
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


