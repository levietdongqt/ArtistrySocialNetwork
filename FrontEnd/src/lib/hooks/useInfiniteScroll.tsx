'use client';
import {useCallback, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import useSWR, { SWRConfiguration } from "swr";

import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import { Loading } from '@components/ui/loading';
import {getPostsCount} from "../../services/realtime/realtimeservice";

export function useInfiniteScroll(
    fetchPostsFunc: (limit: number) => fetcherParams,
    options?: { initialSize?: number; stepSize?: number; marginBottom?: number }
) {
  const { initialSize, stepSize, marginBottom } = options ?? {};
  const [tweetsLimit, setTweetsLimit] = useState(initialSize ?? 20);
  const [tweetsSize, setTweetsSize] = useState<number | null>(null);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [loadMoreInView, setLoadMoreInView] = useState(false);

    const fetchPosts = () => fetchPostsFunc(tweetsLimit);
    const { data:value, isLoading } = useSWR(fetchPosts, fetcherWithToken);

    const { data: countData } = useSWR(getPostsCount(), fetcherWithToken);

  useEffect(() => {
    setTweetsSize(countData?.data);
  }, [countData?.data]);

  useEffect(() => {
    const checkLimit = tweetsSize ? tweetsLimit >= tweetsSize : false;
    setReachedLimit(checkLimit);
  }, [tweetsSize, tweetsLimit]);
  console.log("TEST", tweetsLimit)
  console.log("TEST2", tweetsSize)
  console.log("TEST3", loadMoreInView)

  useEffect(() => {
    if (reachedLimit) return;
    if (loadMoreInView) setTweetsLimit(tweetsLimit + (stepSize ?? 20));
  }, [loadMoreInView]);

  const makeItInView = (): void => setLoadMoreInView(true);
  const makeItNotInView = (): void => setLoadMoreInView(false);

  const isLoadMoreHidden = reachedLimit && (value?.data.length ?? 0) >= (tweetsSize ?? 0);

  const LoadMore = useCallback(
      (): JSX.Element => (
          <motion.div
              className={isLoadMoreHidden ? 'hidden' : 'block'}
              viewport={{ margin: `0px 0px ${marginBottom ?? 1000}px` }}
              onViewportEnter={makeItInView}
              onViewportLeave={makeItNotInView}
          >
            <Loading className='mt-5' />
          </motion.div>
      ),
      [isLoadMoreHidden]
  );

  return { value, isLoading, LoadMore };
}