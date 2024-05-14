'use client'
import React, {ReactNode, useEffect} from 'react';
import {AnimatePresence} from "framer-motion";
import {ContentPost} from "../content/content";
import {getPostsLimit} from "../../../../services/realtime/clientRequest/postClient";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import {Error} from '@components/ui/error';
import InfiniteScroll from "react-infinite-scroll-component";
import {useSearch} from "../../../../context/search-context";
import {useRecoilState} from "recoil";
import {mutateState} from "@lib/hooks/mutateState";


function ContainerHome() {
    const { paginatedPosts:Data, isLoadingMore,LoadMore,isReachedEnd,setSize,size,mutate,error } =
    useInfiniteScroll(
        getPostsLimit
    );
    const [, setMutateFunction ] = useRecoilState(mutateState);
    useEffect(() => {
        setMutateFunction(() => mutate);
    }, [mutate, setMutateFunction]);

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
                    <InfiniteScroll style={{overflow: 'initial'}} next={() => setSize(size as number + 1)}
                                    hasMore={!isReachedEnd}
                                    loader={<LoadMore />}
                                    dataLength={Data?.length as number ?? 0}
                                    endMessage={!isReachedEnd ? theEndPost() : ''}>
                        <AnimatePresence mode='popLayout'>
                            {Data?.map((content) =>
                                <ContentPost {...content} key={content?.id}/>
                            )}
                        </AnimatePresence>
                    </InfiniteScroll>
                </>
            )}
        </section>
    );
}

export default ContainerHome;