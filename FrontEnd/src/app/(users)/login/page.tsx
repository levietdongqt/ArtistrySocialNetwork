import { AuthLayout } from '../_components/layout/auth-layout';
import { SEO } from '../_components/common/seo';
import { LoginMain } from '../_components/login/login-main';
import { LoginFooter } from '../_components/login/login-footer';
import type { ReactElement, ReactNode } from 'react';

export default function Login(): JSX.Element {
    return (
        <div className='grid min-h-screen grid-rows-[1fr,auto]'>
            <SEO
                title='Twitter - It’s what’s happening'
                description='From breaking news and entertainment to sports and politics, get the full story with all the live commentary.'
            />
            <LoginMain />
            <LoginFooter />
        </div>
    );
}

Login.getLayout = (page: ReactElement): ReactNode => (
    <AuthLayout>{page}</AuthLayout>
);
