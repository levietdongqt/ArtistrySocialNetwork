'use client'
import { AnimatePresence } from 'framer-motion';
import {useWindow} from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { HomeLayout, ProtectedLayout } from './_components/layout/common-layout';
import { MainLayout } from './_components/layout/main-layout';
import { SEO } from './_components/common/seo';
import { MainContainer } from './_components/home/main-container';
import { Input } from './_components/input/input';
import { UpdateUsername } from './_components/home/update-username';
import { MainHeader } from './_components/home/main-header';
import { Tweet } from './_components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';

export default function Home(){
    // const { isMobile } = useWindow();
    /*console.log("Home " + UseTweet().data);
    const { data, loading, LoadMore } = useInfiniteScroll(
        UseTweet().data,
        { allowNull: true, preserve: true },
        { marginBottom: 500 }
    );*/
    const loading = false;
    return (

            <ProtectedLayout>
            <MainLayout>
                <HomeLayout>
                    <MainContainer>
                        <SEO title='Home / Twitter' />
                        <MainHeader
                            useMobileSidebar
                            title='Home'
                            className='flex items-center justify-between'
                        >
                            <UpdateUsername />
                        </MainHeader>
                        {/* {!isMobile && <Input />} */}
                        <section className='mt-0.5 xs:mt-0'>
                            {loading ? (
                                <Loading className='mt-5' />
                            ) : /*!data ? (
                                <Error message='Something went wrong' />
                            ) : */(
                                <>
                                    <AnimatePresence mode='popLayout'>
                                        {/*{data.map((tweet) => (*/}
                                            {/*<Tweet {...tweet} key={tweet.id}/>*/}
                                            <Tweet modal parentTweet pinned={false}/>
                                      {/*  ))}*/}
                                    </AnimatePresence>
                                   {/* <LoadMore />*/}
                                </>
                            )}
                        </section>
                        
                    </MainContainer>
                </HomeLayout>
            </MainLayout>
        </ProtectedLayout>
    );
}

