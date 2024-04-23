'use client'
import React, {useEffect} from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {ContentPost} from "../content/content";
import {getCookie} from "cookies-next";
import {getPostsLimit} from "../../../../services/realtime/clientRequest/postClient";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import { Error } from '@components/ui/error';
import useSWR from "swr";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Post} from "@models/post";

function ContainerHome() {
    const { allData, isLoadingInitialData, LoadMore } = useInfiniteScroll(
        getPostsLimit,
    );
    return (
        <section className='mt-0.5 xs:mt-0'>
            {isLoadingInitialData ? (
                <Loading className='mt-5' />
            ) : allData?.length === 0 ? (
                <Error message='Something went wrong' />
            ) : (
                <>
                    <AnimatePresence mode='popLayout'>
                        {allData?.map((content) => (
                            <ContentPost {...content} key={content.id}/>
                        ))}
                    </AnimatePresence>
                    <LoadMore />
                </>
            )}
        </section>
    );
}

export default ContainerHome;