'use client'
import React, {ReactNode, useState} from 'react';
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {ContentPost} from "../content/content";
import {getCookie} from "cookies-next";
import {getPostsLimit} from "../../../../services/realtime/clientRequest/postClient";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import { Error } from '@components/ui/error';
import {Post} from "@models/post";
import InfiniteScroll from "react-infinite-scroll-component";


function ContainerHome() {
    const { paginatedPosts:Data, isLoadingMore,LoadMore,isReachedEnd,setSize,size,mutate,error } =
    useInfiniteScroll(
        getPostsLimit
    );
    const theEndPost = ():ReactNode =>{
        return (
            <div className={'mt-10'}>
                <p className='text-center text-gray-500 text-2xl font-bold'>Không còn bài viết</p>
            </div>
        )
    }
    return (
        <section className='mt-0.5 xs:mt-0'>
            {Data?.length === 0 ? (
                <Error message='Something went wrong' />
            ) : (
                <>
                    <InfiniteScroll style={{overflow:'initial',maxHeight: '100vh'}} className={'h-max'} next={() => setSize(size as number + 1)}
                                    hasMore={!isReachedEnd}
                                    loader={<LoadMore />}
                                    dataLength={Data?.length as number ?? 0}
                                    endMessage={!isReachedEnd ? theEndPost() : ''}>
                        <AnimatePresence mode='popLayout'>
                            {Data?.map((content) =>
                                <ContentPost {...content} key={content.id}/>
                            )}
                        </AnimatePresence>
                    </InfiniteScroll>
                </>
            )}
        </section>
    );
}

export default ContainerHome;