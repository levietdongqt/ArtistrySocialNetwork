'use client'
import React, {useEffect} from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {Content} from "../content/content";
import {getCookie} from "cookies-next";
import {useAuth} from "../../../../context/auth-context";
import {getPosts} from "../../../../services/realtime/realtimeservice";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import { Error } from '@components/ui/error';
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
function ContainerHome() {
    const { value, isLoading, LoadMore } = useInfiniteScroll(
        getPosts,
        { marginBottom: 500 }
    );

    return (
            <section className='mt-0.5 xs:mt-0'>
                {isLoading ? (
                    <Loading className='mt-5' />
                ) : !value ? (
                                <Error message='Something went wrong' />
                            ) : (
                    <>
                        <AnimatePresence mode='popLayout'>
                        {value?.data.map((content: any) => (
                            <Content {...content} key={content.id}/>
                        ))}
                        </AnimatePresence>
                         <LoadMore />
                    </>
                )}
            </section>
    );
}

export default ContainerHome;