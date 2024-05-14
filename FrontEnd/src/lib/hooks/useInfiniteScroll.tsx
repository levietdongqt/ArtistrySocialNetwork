'use client';
import useSWRInfinite, {SWRInfiniteKeyLoader, SWRInfiniteResponse} from 'swr/infinite';
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import { Loading } from '@components/ui/loading';
import { motion } from 'framer-motion';
import {useUser} from "../../context/user-context";
import {Button} from "@components/ui/button";
import {SWRConfiguration} from "swr";
import {useParams} from "next/navigation";
type InfiniteScrollResult = {
    paginatedPosts: any[] | undefined;
    error: any;
    isReachedEnd: boolean | undefined;
    isLoadingMore: boolean | undefined;
    LoadMore: () => JSX.Element;
    size: number | undefined;
    setSize: (size: number) => void;
    mutate: any;
}


export function useInfiniteScroll(
    fetcher: (userId?: string, limit?: number, pageIndex?: number) => fetcherParams,
    options?: SWRConfiguration
) : InfiniteScrollResult {
    const {currentUser} = useUser();
    const {ID} = useParams();
    const PAGE_SIZE = 7;
    const userId = ID ?? currentUser?.id;
    const getKey:SWRInfiniteKeyLoader = (index:number,previousPageData:any)  =>{
        return fetcher(userId as string,PAGE_SIZE,index);
    }
    const {data:posts,size,setSize,error,mutate} = useSWRInfinite(getKey,fetcherWithToken,{
        ...options
    });
    const paginatedPosts = posts?.map(post =>post?.data).flat();
    const isReachedEnd = posts?.map(post =>post?.data) && posts?.map(post =>post?.data)[posts?.map(post =>post?.data).length -1]?.length < PAGE_SIZE - 1;
    const isLoadingMore = posts && typeof posts[size -1] === 'undefined';
    const LoadMore = () => (
        <motion.div>
            <Loading className='mt-5' />
        </motion.div>
    );
    return {paginatedPosts,error,isLoadingMore,isReachedEnd,LoadMore,size,setSize,mutate};
}