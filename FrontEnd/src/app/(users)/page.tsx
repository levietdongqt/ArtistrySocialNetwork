
import { HomeLayout } from './_components/layout/common-layout';
import { SEO } from './_components/common/seo';
import { MainContainer } from './_components/home/main-container';
import { UpdateUsername } from './_components/home/update-username';
import { MainHeader } from './_components/home/main-header';
import InputMobile from "./_components/input/InputMobile";
import ContainerHome from "./_components/container/ContainerHome";
import { cookies } from 'next/headers';

export default function Home(){
    var cookies2 = cookies().get("user");
    console.log(cookies2);
    const loading = false;
    return (
        <HomeLayout>
                    <MainContainer>
                        <SEO title='Home / Social' />
                        <MainHeader
                            useMobileSidebar
                            title='Trang chủ'
                            className='flex items-center justify-between'
                        >
                            <UpdateUsername />
                        </MainHeader>
                        <InputMobile />
                        <ContainerHome />
                    </MainContainer>
                </HomeLayout>
    );
}