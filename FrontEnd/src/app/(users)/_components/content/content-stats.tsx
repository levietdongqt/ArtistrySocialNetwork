/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'clsx';
import { ViewTweetStats } from '../view/view-tweet-stats';
import { TweetOption } from './content-option';
import { ContentShare } from './content-share';
import type { Post } from '@models/post';
import {useModal} from "@lib/hooks/useModal";
import {Modal} from "../modal/modal";
import {ContentReplyModal} from "../modal/content-reply-modal";

type TweetStatsProps = Pick<
  Post,
  'userPostLikes' | 'userReplies' | 'tagUserPosts'
> & {
  userId: string;
  isOwner: boolean;
  tweetId: string;
  viewTweet?: boolean;
  openModal?: () => void;
};

export function ContentStats({
  userId,
  isOwner,
  tweetId,
  userPostLikes,
  viewTweet,
   tagUserPosts,
  userReplies: totalReplies,
  openModal,
}: TweetStatsProps): JSX.Element {
  const totalLikes = userPostLikes?.length;
  const totalTweets = tagUserPosts?.length;
  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  }, [totalReplies, totalLikes, totalTweets]);


  const replyMove = useMemo(
    () => (totalReplies > currentReplies ? -25 : 25),
    [totalReplies]
  );

  const likeMove = useMemo(
    () => (totalLikes > currentLikes ? -25 : 25),
    [totalLikes]
  );

  const tweetMove = useMemo(
    () => (totalTweets > currentTweets ? -25 : 25),
    [totalTweets]
  );

  const tweetIsLiked = userPostLikes?.map((user) => user.id == userId);
  const tweetIsPosts = tagUserPosts?.map((user) => user.id == userId);

  const isStatsVisible = !!(totalReplies || totalTweets || totalLikes);


  return (
    <>
      {viewTweet && (
        <ViewTweetStats
          likeMove={likeMove}
          userLikes={userPostLikes}
          tweetMove={tweetMove}
          replyMove={replyMove}
          userRetweets={tagUserPosts}
          currentLikes={currentLikes}
          currentTweets={currentTweets}
          currentReplies={currentReplies}
          isStatsVisible={isStatsVisible}
        />
      )}
      <div
        className={cn(
          'flex text-light-secondary inner:outline-none dark:text-dark-secondary',
          viewTweet ? 'justify-around py-2' : 'max-w-md justify-between'
        )}
      >
        <TweetOption
              className='hover:text-accent-blue focus-visible:text-accent-blue'
              iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                       group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
              tip='Comments'
              move={replyMove}
              stats={currentReplies}
              iconName='ChatBubbleOvalLeftIcon'
              viewTweet={viewTweet}
              onClick={openModal}
              disabled={open}
          />
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
            tweetIsLiked && 'text-accent-pink [&>i>svg]:fill-accent-pink'
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={tweetIsLiked ? 'Unlike' : 'Like'}
          move={likeMove}
          stats={currentLikes}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={/*manageLike(
            tweetIsLiked ? 'unlike' : 'like',
            userId,
            tweetId
          )*/() =>{}}
        />
        <ContentShare userId={userId} tweetId={tweetId} viewTweet={viewTweet} />
        {isOwner && (
          <TweetOption
            className='hover:text-accent-blue focus-visible:text-accent-blue'
            iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 
                           group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
            tip='Analytics'
            iconName='ChartPieIcon'
            disabled
          />
        )}
      </div>
    </>
  );
}
