import { AuthLayout } from '../_components/layout/auth-layout';
import { SEO } from '../_components/common/seo';
import { LoginMain } from '../_components/login/login-main';
import { LoginFooter } from '../_components/login/login-footer';


export default function Login(): JSX.Element {
    return (
        <AuthLayout>
            <div className='grid min-h-screen grid-rows-[1fr,auto]'>
            <SEO
                title='Social'
                description='Booking services and hire services'
            />
            <LoginMain />
            <LoginFooter />
        </div>
        </AuthLayout>
    );
}


