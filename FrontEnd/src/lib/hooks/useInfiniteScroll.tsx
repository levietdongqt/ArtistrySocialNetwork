/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import type { UseCollectionOptions } from './useCollection';
import {UseUser} from './useUser';

type InfiniteScroll = {
  data: [] | null;
  loading: boolean;
  LoadMore: () => JSX.Element;
};

type InfiniteScrollWithUser = {
  data: [] | null;
  loading: boolean;
  LoadMore: () => JSX.Element;
};

export function useInfiniteScroll(
    collection: [],
  fetchOptions: UseCollectionOptions & { includeUser: true },
  options?: { initialSize?: number; stepSize?: number; marginBottom?: number }
): InfiniteScrollWithUser;

export function useInfiniteScroll(
    collection: [],
  fetchOptions?: UseCollectionOptions,
  options?: { initialSize?: number; stepSize?: number; marginBottom?: number }
): InfiniteScroll;

export function useInfiniteScroll(
    collection: [],
  fetchOptions?: UseCollectionOptions,
  options?: { initialSize?: number; stepSize?: number; marginBottom?: number }
): InfiniteScroll | InfiniteScrollWithUser {
  const { initialSize, stepSize, marginBottom } = options ?? {};
  const [tweetsLimit, setTweetsLimit] = useState(initialSize ?? 20);
  const [tweetsSize, setTweetsSize] = useState<number | null>(null);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { data, loading } = UseUser();

  useEffect(() => {
    const checkLimit = tweetsSize ? tweetsLimit >= tweetsSize : false;
    setReachedLimit(checkLimit);
  }, [tweetsSize, tweetsLimit]);

  useEffect(() => {
    if (reachedLimit) return;

    const setTweetsLength = async (): Promise<void> => {
      const currentTweetsSize = data?.length;
      setTweetsSize(currentTweetsSize ?? null);
    };

    void setTweetsLength();
  }, [data?.length]);

  useEffect(() => {
    if (reachedLimit) return;
    if (loadMoreInView) setTweetsLimit(tweetsLimit + (stepSize ?? 20));
  }, [loadMoreInView]);

  const makeItInView = (): void => setLoadMoreInView(true);
  const makeItNotInView = (): void => setLoadMoreInView(false);

  const isLoadMoreHidden =
    reachedLimit && (data?.length ?? 0) >= (tweetsSize ?? 0);

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

  return {data, loading, LoadMore} as InfiniteScroll;
}
