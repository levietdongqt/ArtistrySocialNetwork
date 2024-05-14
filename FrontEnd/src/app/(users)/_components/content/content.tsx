'use client'
import {AnimatePresence, motion} from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import {delayScroll, sleep} from '@lib/utils';
import { Modal } from '../modal/modal';
import { ContentReplyModal } from '../modal/content-reply-modal';
import { ImagePreview } from '../input/image-preview';
import { UserAvatar } from '../user/user-avatar';
import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';
import { ContentAction } from './content-action';
import { ContentStats } from './content-stats';
import { ContentDate } from './content-date';
import type { Variants } from 'framer-motion';
import React, {useState} from "react";
import {User} from "@models/user";
import {Post} from "@models/post";
import {ImagesPreview} from "@models/file";
import {useUser} from "../../../../context/user-context";
import {Button} from "@components/ui/button";
import {HeroIcon} from "@components/ui/hero-icon";
import {undoReport} from "../../../../services/realtime/ServerAction/ReportService";



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

export function ContentPost(tweet: TweetProps) {
  const [IsCheckReport, setIsCheckReport] = useState<boolean>(false);
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
    modal,
    profile,
    parentTweet,
      comment
  } = tweet;
  const { id: ownerId, fullName, verified, avatar,coverImage,bio } = postUserData;
  const { currentUser } = useUser();
  const userId = currentUser?.id as string;
  const isOwner = userId === createdBy;
  const { open, openModal, closeModal } = useModal();
  const { id: parentId, fullName: parentUsername = fullName } = postUserData ?? {};
  const postLink = `/post/${postId}`;
  const handleReported = (check:boolean): void => {
    setIsCheckReport(check);
  }
  const handleUndo = async () =>{
    await undoReport(userId,postId);
    await sleep(1000);
    setIsCheckReport(false);
  }
  if (IsCheckReport) {
    return (
        <AnimatePresence>
          <motion.div animate={{...variants.animate}} className={'flex justify-evenly h-14 py-3 px-4 my-3 border-solid border-y-[1px] border-black'}>
            <div className={'flex justify-start w-full items-center'}>
              <HeroIcon iconName={'FlagIcon'}/>
              <div className={'w-full ml-5'}>
                <p className={'font-bold text-xl'}>Bị ẩn</p>
                <span className={'text-xs text-gray-500'}>Nhờ hoạt động báo cáo chúng tôi sẽ sử lý như mong muốn</span>
              </div>

            </div>
            <div className={'flex justify-end w-[30%] items-center'}>
              <Button onClick={handleUndo} className={cn(`custom-button main-tab font-bold hover:bg-blue-400`)}>Hoàn tác</Button>
            </div>
          </motion.div>
        </AnimatePresence>
    );
  }
  return (
      <motion.article
          {...(!modal ? {...variants, layout: 'position'} : {})}
          animate={{
            ...variants.animate,
            ...(parentTweet && {transition: {duration: 0.2}})
          }}
      >
        <Modal
            className='flex items-start justify-center'
            modalClassName='bg-main-background rounded-2xl max-w-2xl w-full my-8 overflow-y-auto scrollbar-thin scrollbar-webkit max-h-[700px] mx-4'
            open={open}
            closeModal={closeModal}
        >
          <ContentReplyModal post={tweet} closeModal={closeModal}/>
        </Modal>
        <div className={cn(
            `accent-tab hover-card relative flex flex-col 
             gap-y-4 px-4 py-3 outline-none duration-200`,
          parentTweet
              ? 'mt-0.5 pt-2.5 pb-0'
              : 'border-b border-light-border dark:border-dark-border',
          {
            'border-gray-600 mx-4' : comment
          }
      )}
            onClick={delayScroll(200)}
      >
        <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
          <div className='flex flex-col items-center gap-2'>
            <UserTooltip avatarCheck modal={modal} {...postUserData} >
              <UserAvatar  id={parentId} src={avatar} alt={fullName ?? 'tao nè 1'} username={fullName ?? 'Customer 1'} />
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
                        id={parentId}
                        name={fullName ?? 'tào nè 1'}
                        username={fullName}
                        verified={verified}
                        className='text-light-primary dark:text-dark-primary'
                    />
                </UserTooltip>
                <ContentDate tweetLink={postLink} createdAt={createdAt} />
              </div>
              <div className='px-4'>
                {!modal && (
                    <ContentAction
                        reported={handleReported}
                        isOwner={isOwner}
                        ownerId={ownerId}
                        postId={postId}
                        username={fullName}
                        hasImages={!!mediaUrl}
                        createdBy={createdBy}
                    />
                )}
              </div>
            </div>
            {content && (
                <p className='whitespace-pre-line break-words'>{content}</p>
            )}
            <div className='mt-1 flex flex-col gap-2'>
              {mediaUrl?.length as number > 0  && (
                  <ImagePreview
                      post
                      imagesPreview={mediaUrl as ImagesPreview}
                      previewCount={mediaUrl?.length as number }
                  />
              )}
              <ContentStats
                  viewTweet={false}
                  avatar={currentUser?.avatar as string}
                  username={currentUser?.fullName as string}
                  comment={comment}
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
          </div>
        </div>
      </div>

    </motion.article>
  );
}
