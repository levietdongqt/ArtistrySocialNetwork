'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { useAuth } from '../../../../context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { ContentReplyModal } from '../modal/content-reply-modal';
import { ImagePreview } from '../input/image-preview';
import { UserAvatar } from '../user/user-avatar';
import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';
import { UserUsername } from '../user/user-username';
import { variants } from '../content/content';
import { ContentAction } from '../content/content-action';
import { ContentStats } from '../content/content-stats';
import { ContentDate } from '../content/content-date';
import { Input } from '../input/input';
import type { RefObject } from 'react';
import boolean from "async-validator/dist-types/validator/boolean";
import {Timestamp} from "firebase/firestore";
import {Post} from "@models/post";
import {useUser} from "../../../../context/user-context";
import { User } from '@models/user';
import {ImagesPreview} from "@models/file";
import React from "react";

type ViewPostProps =  Post & {
  user: User;
  viewTweetRef?: RefObject<HTMLElement>;
  comment?: boolean;
};

export function ViewContent(post: ViewPostProps): JSX.Element {
  const {
    id:postId,
    user: postUserData,
    content,
    mediaUrl,
    createdBy,
    createdAt,
    updatedAt,
    status,
    tagUserPosts,
    userPostLikes,
    priorityScore,
    userReplies,
    totalLikes,
    totalComments,
    viewTweetRef,
    comment
  } = post;
  const { id: ownerId, fullName, verified, avatar } = postUserData;
  const {currentUser} = useUser();
  const { open, openModal, closeModal } = useModal();

  const postLink = `/post/${postId}`;

  const userId = currentUser?.id as string;

  const isOwner = userId === createdBy;
  return (
    <motion.article
      className={cn(
        `accent-tab h- relative flex cursor-default flex-col gap-3 border-b
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
      )}
      {...variants}
      animate={{ ...variants.animate, transition: { duration: 0.2 } }}
      exit={undefined}
      ref={viewTweetRef}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <ContentReplyModal post={post} closeModal={closeModal} />
      </Modal>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserTooltip avatarCheck {...postUserData}>
            <UserAvatar src={avatar} alt={fullName} username={fullName} />
          </UserTooltip>
          <div className='flex min-w-0 justify-between'>
            <div className='flex flex-col truncate xs:overflow-visible xs:whitespace-normal'>
              <UserTooltip {...postUserData}>
                <UserName
                    className='-mb-1'
                    name={fullName}
                    username={fullName}
                    verified={verified}
                />
              </UserTooltip>
            </div>
            <div className='px-4'>
              <ContentAction
                viewTweet
                isOwner={isOwner}
                ownerId={ownerId}
                postId={postId}
                username={fullName}
                hasImages={!!mediaUrl}
                createdBy={createdBy}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {content && (
          <p className='whitespace-pre-line break-words text-2xl'>{content}</p>
        )}
        {mediaUrl?.length as number > 0 && (
          <ImagePreview
            viewTweet
            imagesPreview={mediaUrl as ImagesPreview}
            previewCount={mediaUrl?.length as number}
          />
        )}
        <div
          className='inner:hover-animation inner:border-b inner:border-light-border
                     dark:inner:border-dark-border'
        >
          <ContentDate viewTweet tweetLink={postLink} createdAt={createdAt} />
          <ContentStats
              comment={comment}
              viewTweet={false}
              avatar={currentUser?.avatar as string}
              username={currentUser?.fullName as string}
              userId={userId}
              bio={currentUser?.bio as string}
              verified={currentUser?.verified}
              coverImage={currentUser?.coverImage as string}
              isOwner={!isOwner}
              postId={postId}
              userPostLikes={userPostLikes}
              tagUserPosts={tagUserPosts}
              totalComments={totalComments}
              openModal={openModal}
          />
        </div>
        <Input reply postID={post?.id}
               modal
               replyModal
               closeModal={closeModal}
               comment />
      </div>
    </motion.article>
  );
}
