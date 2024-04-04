'use server'
import { HomeLayout } from '../../_components/layout/common-layout';
import { SEO } from '../../_components/common/seo';
import { MainContainer } from '../../_components/home/main-container';
import { UpdateUsername } from '../../_components/home/update-username';
import { MainHeader } from '../../_components/home/main-header';
import InputMobile from "../../_components/input/InputMobile";
import ContainerHome from "../../_components/container/ContainerHome";
import {getCookie} from "cookies-next";
import Link from "next/link";

export default async function Home(){
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