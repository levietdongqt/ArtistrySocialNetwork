'use client'

import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { delayScroll } from '@lib/utils';
import { Modal } from '../modal/modal';
import { ContentReplyModal } from '../modal/content-reply-modal';
import { ImagePreview } from '../input/image-preview';
import { UserAvatar } from '../user/user-avatar';
import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';
import { UserUsername } from '../user/user-username';

import type { Variants } from 'framer-motion';
import {Timestamp} from "firebase/firestore";
import {ViewContent} from "../view/view-content";
import React, {useEffect, useMemo, useState} from "react";
import {User} from "@models/user";
import {Loading} from "@components/ui/loading";
import {useAuth} from "../../../../context/oauth2-context";
import {Comments} from "@models/comment";
import {ImagesPreview} from "@models/file";
import {useUser} from "../../../../context/user-context";
import {ContentDate} from "../content/content-date";
import {ContentAction} from "../content/content-action";
import {ContentStats} from "../content/content-stats";
import {TweetOption} from "../content/content-option";
import useSWR, {mutate} from "swr";
import {likePosts} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {likeComment} from "../../../../services/realtime/clientRequest/commentClient";

export type CommentProps = Comments & {
  user?: User;
  modal?: boolean;
  pinned?: boolean;
  profile?: User | null;
  parentTweet?: boolean;
  comment?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function Comment(comment: CommentProps) {
  const {
      id,
      content,
      sentDate,
      updatedDate,
      mediaUrl,
      postId,
      commentId,
      byUser: postUserData,
      commentsLikes,
      tagUserComments,
      totalLikes,
      totalReply,
      user,
    modal,
    pinned,
    profile,
    parentTweet,
  } = comment;
  const { currentUser } = useUser();
  const userId = currentUser?.id as string;
  const [isLike, setIsLike] = useState(commentsLikes?.map((data:any) => data?.id).some(likeID => likeID === userId));
  const [totalLike, setTotalLike] = useState(commentsLikes?.length as number);
  const [isComment, setIsComment] = useState({});
  const [{ currentLikes }, setCurrentStats] =
      useState({
        currentLikes: totalLike,
      });
  const viewTweet = false;
  const { id: ownerId, fullName, verified, avatar,coverImage,bio } = postUserData;

  const { open, openModal, closeModal } = useModal();
  const { id: parentId, fullName: parentUsername = fullName } = postUserData ?? {};
  const isOwner = userId === postUserData.id;
  // const {
  //   id: profileId,
  //   fullName: profileUsername
  // } = profile ?? {};
  const {data,mutate } = useSWR(likeComment(isComment),fetcherWithToken, { revalidateOnFocus: false });

  const handleLikesComment = async (type: 'Like' | 'Unlike'): Promise<void> => {
    const currentIsLiked = isLike;
    const nextIsLiked = type === 'Like';

    // Cập nhật trạng thái và số lượt like ngay lập tức cho giao diện người dùng
    setIsLike(nextIsLiked);
    setCurrentStats(prevStats => ({
      ...prevStats,
      currentLikes: prevStats.currentLikes + (nextIsLiked ? 1 : -1),
    }));

    try {
      const dataCommentLike = {
        commentId: id,
        byUser: {
          id: currentUser?.id as string,
          fullName: currentUser?.fullName as string || null,
          avatar: currentUser?.avatar as string || null,
          coverImage: currentUser?.coverImage as string || null,
          bio: currentUser?.bio as string || null,
          verified: false
        }
      };
      if (currentIsLiked !== nextIsLiked) {
        setIsComment(dataCommentLike);
        await mutate(isComment);
      }
    } catch (error) {
      setIsLike(currentIsLiked);
      setCurrentStats(prevStats => ({
        ...prevStats,
        currentLikes: prevStats.currentLikes - (nextIsLiked ? 1 : -1),
      }));
      console.error('Failed to update like status:', error);
    }
  };
  useEffect(() => {
    setCurrentStats({
      currentLikes: totalLikes,
    });
  }, [totalLikes]);
  const likeMove = useMemo(
      () => (totalLikes > currentLikes ? -25 : 25),
      [totalLikes]
  );
  return (
    <motion.article
      {...(!modal ? { ...variants, layout: 'position' } : {})}
      animate={{
        ...variants.animate,
        ...(parentTweet && { transition: { duration: 0.2 } })
      }}
    >
      <div className={cn(
          `accent-tab hover-card relative max-h-[500px] flex flex-col z-10
       gap-y-4 px-4 py-3 outline-none duration-200`,
          parentTweet
              ? 'mt-0.5 pt-2.5 pb-0'
              : 'border-b border-light-border dark:border-dark-border'
      )}
           onClick={delayScroll(200)}
      >
        <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
          <div className='flex flex-col items-center gap-2'>
            <UserTooltip avatarCheck modal={modal} {...postUserData} >
              <UserAvatar src={avatar} alt={fullName ?? 'Customer 1'} username={fullName ?? 'Customer 1'} />
            </UserTooltip>
            {parentTweet && (
                <i className='hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
            )}
          </div>
          <div className='flex min-w-0 flex-col'>
            <div className='flex justify-between gap-2 text-light-secondary dark:text-dark-secondary'>
              <div className='flex gap-1 truncate xs:overflow-visible xs:whitespace-normal'>
                <UserTooltip modal={modal} {...postUserData}>
                  <UserName
                      name={fullName ?? 'Customer 1'}
                      username={fullName}
                      verified={verified}
                      className='text-light-primary dark:text-dark-primary'
                  />
                </UserTooltip>
                <ContentDate tweetLink={'tweetLink'} createdAt={sentDate} />
              </div>
              <div className='px-4'>
                {!modal && (
                    <ContentAction
                        isOwner={isOwner}
                        ownerId={ownerId}
                        postId={postId}
                        parentId={parentId}
                        username={fullName}
                        hasImages={!!mediaUrl}
                        createdBy={sentDate}
                    />
                )}
              </div>
            </div>
            {content && (
                <p className='whitespace-pre-line break-words'>{content}</p>
            )}
            <div className='mt-1 flex flex-col gap-2'>
              {mediaUrl?.length > 0 && (
                  <ImagePreview
                      post
                      imagesPreview={mediaUrl}
                      previewCount={mediaUrl?.length}
                  />
              )}
              <div className={'flex items-center'}>
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
                    onClick={() => handleLikesComment(
                        isLike ? 'Unlike' : 'Like'
                    )}
                />
                <button className='ml-5 text-light-primary dark:text-dark-secondary hover:text-accent-blue hover:dark:text-accent-blue hover:underline'>
                  phản hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.article>
  );
}
