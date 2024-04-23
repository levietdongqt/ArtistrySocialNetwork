import { useEffect } from 'react';

import { Content } from '../content/content';
import type { RefObject } from 'react';
import useSWR from "swr";
import {getPostById} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";

type ViewParentTweetProps = {
  parentId: string;
  viewTweetRef: RefObject<HTMLElement>;
};

export function ViewParentTweet({
  parentId,
  viewTweetRef
}: ViewParentTweetProps): JSX.Element | null {

  const {data:postData, isLoading,mutate:postMutate} = useSWR(getPostById(parentId as string), fetcherWithToken);

  useEffect(() => {
    if (!isLoading) viewTweetRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData?.data?.id, isLoading]);

  if (isLoading) return null;
  if (!postData?.data)
    return (
      <div className='px-4 pt-3 pb-2'>
        <p
          className='rounded-2xl bg-main-sidebar-background py-3 px-1 pl-4 
                     text-light-secondary dark:text-dark-secondary'
        >
          This Post was deleted by the post author.{' '}
          <a
            className='custom-underline text-main-accent'
            href='https://help.twitter.com/rules-and-policies/notices-on-twitter'
            target='_blank'
            rel='noreferrer'
          >
            Learn more
          </a>
        </p>
      </div>
    );

  return <Content parentTweet {...postData?.data} />;
}
