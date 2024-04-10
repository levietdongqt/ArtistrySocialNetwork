/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'clsx';
import { ViewTweetStats } from '../view/view-tweet-stats';
import { TweetOption } from './content-option';
import { ContentShare } from './content-share';
import type { Post } from '@models/post';
import useSWR from "swr";
import {likePosts} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";


type PostStatsProps = Pick<
  Post,
  'userPostLikes' | 'userReplies' | 'tagUserPosts'
> & {
  userId: string;
  isOwner?: boolean;
  coverImage: string,
  username: string;
  avatar: string;
  icon?: string;
  bio:string;
  postId: string;
  viewTweet?: boolean;
  openModal?: () => void;
  comment?: boolean;
  verified?: boolean;
};

export function ContentStats({
  userId,
  isOwner,
  postId,
  userPostLikes,
  username, avatar,
 coverImage,bio,verified,
  icon,
  viewTweet,
   tagUserPosts,
  userReplies: totalReplies,
  openModal,
   comment
}: PostStatsProps): JSX.Element {
  const [isLike, setIsLike] = useState(userPostLikes?.map(data => userId).some(likeID => likeID === userId));
  const [totalLikes, setTotalLikes] = useState(userPostLikes?.length as number);
  const totalTweets = tagUserPosts?.length;
  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  const [isStat, setIsStat] = useState({});
  const {data,mutate } = useSWR(likePosts(isStat),fetcherWithToken, { revalidateOnFocus: false });
  const handleLikes = async (type: 'Like' | 'Unlike'): Promise<void> => {
    const currentIsLiked = isLike;
    const nextIsLiked = type === 'Like';

    // Optimistically update the state to provide instant feedback to the user.
    setIsLike(nextIsLiked);
    setTotalLikes(prevLikes => prevLikes + (nextIsLiked ? 1 : -1));
    try {
      const dataLike = {
        postId: postId,
        byUser: {
          id: userId,
          fullName: username,
          avatar: avatar,
          coverImage: coverImage,
          bio: bio,
          verified: verified
        },
      };

      // Only call the API if the next state is different from the current state.
      if (currentIsLiked !== nextIsLiked) {
        setIsStat(dataLike); // This should be where you set up the payload for the API request.
        await mutate(); // Call the API to reflect the change on the server.
      }
    } catch (error) {
      // If the API call fails, revert the optimistic update.
      setIsLike(currentIsLiked);
      setTotalLikes(prevLikes => prevLikes - (nextIsLiked ? 1 : -1));
      console.error('Failed to update like status:', error);
    }
  };
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
  const tweetIsLiked = userPostLikes?.map(data => userId).includes(userId);
  // const tweetIsPosts = tagUserPosts?.includes(userId);
  const isStatsVisible = !!(totalReplies || totalTweets || totalLikes);
  return (
    <>
      {viewTweet && (
        <ViewTweetStats
          likeMove={likeMove}
          userPostLikes={userPostLikes}
          tweetMove={tweetMove}
          replyMove={replyMove}
          tagUserPosts={tagUserPosts}
          currentLikes={currentLikes}
          currentTweets={currentTweets}
          currentReplies={currentReplies}
          isStatsVisible={isStatsVisible}
        />
      )}
      <div
        className={cn(
          'flex text-light-secondary inner:outline-none dark:text-dark-secondary ',
          viewTweet ? 'justify-around py-2' : 'max-w justify-between'
        )}
      >
        { comment ? null : <TweetOption
                className='hover:text-accent-blue focus-visible:text-accent-blue'
                iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                       group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
                tip='Comments'
                move={replyMove}
                stats={currentReplies}
                iconName='ChatBubbleOvalLeftIcon'
                viewTweet={viewTweet}
                onClick={openModal}
            />
        }
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
              isLike && 'text-accent-pink [&>i>svg]:fill-accent-pink'
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={isLike ? 'Unlike' : 'Like'}
          move={likeMove}
          stats={currentLikes}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={() => handleLikes(
              isLike ? 'Unlike' : 'Like'
          )}
        />
        <ContentShare userId={userId} tweetId={postId} viewTweet={viewTweet} />
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
