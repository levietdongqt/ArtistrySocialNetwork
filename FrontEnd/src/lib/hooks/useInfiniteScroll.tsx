'use client';
import {useCallback, useEffect, useState} from 'react';
import useSWRInfinite from 'swr/infinite';
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import { Loading } from '@components/ui/loading';
import { motion } from 'framer-motion';

type InfiniteScrollResult = {
    allData: any[]; // replace `any` with the type of data you are fetching
    error: any; // replace `any` with the error type you expect
    isLoadingInitialData: boolean;
    isLoadingMore: boolean | undefined;
    LoadMore: () => JSX.Element;
    marginBottom: number;
}
const getKey = (fetchPostsFunc: (limit:number, offset:number) => fetcherParams, pageIndex:number, previousPageData:any, stepSize:number) => {
    if (previousPageData && !previousPageData.length) return null;
    return fetchPostsFunc(stepSize, pageIndex * stepSize);
};

export function useInfiniteScroll(
    fetchPostsFunc: (limit: number, offset: number) => fetcherParams,
    stepSize: number = 20,
    marginBottom: number = 1024
) : InfiniteScrollResult {
    const [loadMoreInView, setLoadMoreInView] = useState(false);
    const { data, error, size, setSize,mutate } = useSWRInfinite(
        (pageIndex, previousPageData) => getKey(fetchPostsFunc, pageIndex, previousPageData, stepSize),
        fetcherWithToken,{
            refreshInterval:1000,
        }
    );
    const allData = data ? [].concat(...data.map(value => value.data)) : [];
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isReachingEnd = isLoadingMore || (data && data[data.length - 1]?.length < stepSize);

    const loadMore = useCallback(() => {
        if (!isReachingEnd && !isLoadingMore) {
            setSize(size + 1);
        }
    }, [isReachingEnd, isLoadingMore, size, setSize]);

    useEffect(() => {
        if (loadMoreInView) loadMore();
    }, [loadMoreInView, loadMore]);

    const LoadMore = () => (
        <motion.div
            className={isReachingEnd ? 'hidden' : 'block'}
            viewport={{ margin: `0px 0px ${marginBottom}px` }}
            onViewportEnter={() => setLoadMoreInView(true)}
            onViewportLeave={() => setLoadMoreInView(false)}
        >
            {isLoadingMore && <Loading className='mt-5' />}
        </motion.div>
    );

    return {isLoadingMore: undefined, marginBottom: 0, allData, isLoadingInitialData, LoadMore, error };
}