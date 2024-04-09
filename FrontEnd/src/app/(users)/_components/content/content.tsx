'use client'
import Link from 'next/link';
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
import { ContentAction } from './content-action';
import { ContentStatus } from './content-status';
import { ContentStats } from './content-stats';
import { ContentDate } from './content-date';
import type { Variants } from 'framer-motion';
import {Timestamp} from "firebase/firestore";
import {ViewContent} from "../view/view-content";
import React from "react";
import {User} from "@models/user";
import {Loading} from "@components/ui/loading";
import {useAuth} from "../../../../context/auth-context";
import {Post} from "@models/post";
import {ImagesPreview} from "@models/file";
import {useUser} from "../../../../context/user-context";


export type TweetProps = Post & {
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

export function Content(tweet: TweetProps) {
  const {
    id:postId,
    user: postUserData,
    content,
    images,
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
    modal,
    profile,
    parentTweet,
      comment
  } = tweet;
  const { id: ownerId, fullName, verified, avatar,coverImage,bio } = postUserData;
  console.log("show user ",ownerId)
  const { currentUser } = useUser();
  const userId = currentUser?.id as string;
  const isOwner = userId === createdBy;
  const { open, openModal, closeModal } = useModal();
  const { id: parentId, fullName: parentUsername = fullName } = postUserData ?? {};

  const {
    id: profileId,
    fullName: profileUsername
  } = profile ?? {};

  const images1 = [{
    id: '1',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_color_272x92dp'
  },{
    id: '2',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_ssdssds'
  },{
    id: '3',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_ssdssdssdsdsd'
  },{
    id: '4',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_ssdssdssdsdsdsdsd'
  }];
  return (
    <motion.article
      {...(!modal ? { ...variants, layout: 'position' } : {})}
      animate={{
        ...variants.animate,
        ...(parentTweet && { transition: { duration: 0.2 } })
      }}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <ContentReplyModal tweet={tweet} closeModal={closeModal}  />
      </Modal>
      <div className={cn(
          `accent-tab hover-card relative flex flex-col 
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
                <UserTooltip modal={modal} {...postUserData}>
                  <UserUsername username={fullName ?? 'Customer 1'} />
                </UserTooltip>
                <ContentDate tweetLink={'tweetLink'} createdAt={createdAt} />
              </div>
              <div className='px-4'>
                {!modal && (
                    <ContentAction
                        isOwner={isOwner}
                        ownerId={ownerId}
                        postId={postId}
                        parentId={parentId}
                        username={fullName}
                        hasImages={!!images}
                        createdBy={createdBy}
                    />
                )}
              </div>
            </div>
            {content && (
                <p className='whitespace-pre-line break-words'>{content}</p>
            )}
            <div className='mt-1 flex flex-col gap-2'>
              {images1 && (
                  <ImagePreview
                      tweet
                      imagesPreview={images1}
                      previewCount={images1.length}
                  />
              )}

              <ContentStats
                  avatar={currentUser?.avatar as string}
                  username={currentUser?.fullName as string}
                  comment={comment}
                  userId={userId}
                  bio={currentUser?.bio as string}
                  verified={currentUser?.verified}
                  coverImage={currentUser?.coverImage as string}
                  isOwner={isOwner}
                  postId={postId}
                  userPostLikes={userPostLikes}
                  tagUserPosts={tagUserPosts}
                  userReplies={userReplies}
                  openModal={openModal}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'mt-10'}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ab, ad! Aliquam
          aspernatur

        </p>
      </div>
    </motion.article>
  );
}
