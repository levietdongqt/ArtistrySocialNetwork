import { AuthLayout } from '../_components/layout/auth-layout';
import { SEO } from '../_components/common/seo';
import { LoginMain } from './_components/login-main';


export default function Login(): JSX.Element {
    return (
        <AuthLayout>

            <div className='grid min-h-screen grid-rows-[1fr,auto]'>
             
                    <SEO
                        title='Social'
                        description='Login'
                    />
                    <LoginMain />
                    {/* <LoginFooter /> */}
            </div>
        </AuthLayout>
    );
}


