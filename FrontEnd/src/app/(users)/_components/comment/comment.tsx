'use client'

import {AnimatePresence, motion} from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { delayScroll } from '@lib/utils';
import { ImagePreview } from '../input/image-preview';
import { UserAvatar } from '../user/user-avatar';
import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';


import type { Variants } from 'framer-motion';
import React, {useEffect, useReducer, useState} from "react";
import {User} from "@models/user";

import {Comments} from "@models/comment";
import {useUser} from "../../../../context/user-context";
import {ContentDate} from "../content/content-date";
import {ContentAction} from "../content/content-action";
import {ContentStats} from "../content/content-stats";
import ChildComment from "./ChildComment";
import {Input} from "../input/input";
import {useSocket} from "../../../../context/websocket-context1";
import commentsChildReducer from "./commentChildReducer";
import useSWR from "swr";
import {getCommentByParentId,getCountCommentByParentId} from "../../../../services/realtime/clientRequest/commentClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {Loading} from "@components/ui/loading";
import {Button} from "@components/ui/button";

export type CommentProps = Comments & {
  user?: User;
  modal?: boolean;
  pinned?: boolean;
  profile?: User | null;
  parentTweet?: boolean;
  comment?: boolean;
  replyTags?: boolean;
    childComment?:boolean;
    onOpenChild?: () =>void;
    isOpened?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function Comment(comments: CommentProps) {
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
    comment,
    replyTags,
      childComment,
      onOpenChild,
      isOpened
  } = comments;

    const {stompClient} = useSocket();
    const [state, dispatch] = useReducer(commentsChildReducer, { comments: [] });
    useEffect(() => {
        var subscription2 = stompClient?.subscribe('/topic/commentsChild/' + id as string , (comment) =>{
            dispatch({ type: 'ADD_COMMENT', payload: JSON.parse(comment.body) });
        });
        return () => {
            if (subscription2) {
                subscription2.unsubscribe();
            }
        };
    }, [id,stompClient]);
    const { data: commentsChildData, isLoading: commentLoading } = useSWR(
        getCommentByParentId(id as string), fetcherWithToken
    );
    const { data: countCommentChild, isLoading: commentChildLoading } = useSWR(
        getCountCommentByParentId(id as string), fetcherWithToken
    );
    useEffect(() => {
        if (commentsChildData && commentsChildData?.data) {
            dispatch({ type: 'SET_INITIAL', payload: commentsChildData?.data });
        }
    }, [commentsChildData?.data]);
    const [showCommentChild, setShowCommentChild] = useState(false);

  const handleParentComment = () =>{
      setShowCommentChild(true );
    }
  const { currentUser } = useUser();
  const userId = currentUser?.id as string;
  const viewTweet = false;
  const { id: ownerId, fullName, verified, avatar,coverImage,bio } = postUserData as User;
  const { id: parentId, fullName: parentUsername = fullName } = postUserData ?? {};
  const isOwner = userId === postUserData.id;
  const { open, openModal, closeModal } = useModal();
  const handleOpenChildComment = () =>{
      if (typeof onOpenChild === 'function') {
          onOpenChild(); // Gọi hàm này để thông báo với component cha.
      }
  }
  return (
      <motion.article
          {...(!modal ? {...variants, layout: 'position'} : {})}
          animate={{
              ...variants.animate,
              ...(parentTweet && {transition: {duration: 0.2}})
          }}
      >
          <div className={cn(
              `accent-tab hover-card relative max-h-[100%] flex flex-col
       gap-y-4 px-4 py-3 outline-none duration-200`,
              parentTweet
                  ? 'mt-0.5 pt-2.5 pb-0'
                  : 'border-b border-light-border dark:border-dark-border',{
                  '!pr-0 !pl-[3.813rem]' : childComment
              }
          )}
               onClick={delayScroll(200)}
          >
              <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
                  <div className='flex flex-col items-center gap-2'>
                      <UserTooltip avatarCheck modal={modal} {...postUserData} comment>
                          <UserAvatar src={avatar} alt={fullName ?? 'Customer 1'} username={fullName ?? 'Customer 1'}/>
                      </UserTooltip>
                      {parentTweet && (
                          <i className='hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply'/>
                      )}
                  </div>
                  <div className='flex min-w-0 flex-col'>
                      <div className='flex justify-between gap-2 text-light-secondary dark:text-dark-secondary'>
                          <div className='flex gap-1 truncate xs:overflow-visible xs:whitespace-normal'>
                              <UserTooltip comment modal={modal} {...postUserData}>
                                  <UserName
                                      id={userId}
                                      name={fullName ?? 'Customer 1'}
                                      username={fullName}
                                      verified={verified}
                                      className='text-light-primary dark:text-dark-primary'
                                  />
                              </UserTooltip>
                              <ContentDate tweetLink={'tweetLink'} createdAt={sentDate}/>
                          </div>
                          <div className='px-4'>
                              {!modal && (
                                  <ContentAction
                                      isOwner={isOwner}
                                      commentId={id}
                                      ownerId={ownerId}
                                      postId={postId}
                                      username={fullName}
                                      hasImages={!!mediaUrl}
                                      createdBy={sentDate}
                                      comment
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
                          <ContentStats
                              handleParentComment={handleParentComment}
                              commentsId={id}
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
                              userPostLikes={commentsLikes}
                              tagUserPosts={tagUserComments}
                              totalComments={totalReply}
                              openModal={openModal}
                              replyTags={replyTags}
                              childComments={childComment}
                          />
                      </div>
                  </div>
              </div>
              <div className={cn(`mt-0`)}>
                  {

                      state.comments?.length > 0 ?
                          isOpened ?
                          commentLoading ?
                              (<Loading className='mt-5'/>)
                              : (
                                  <div className={'h-max'}>
                                      {state.comments?.map((commentData:any) => (
                                          <Comment parentTweet comment childComment  replyTags {...commentData} key={commentData.id} />
                                      ))}
                                  </div>
                              )
                          : commentChildLoading ? (<Loading className='mt-2' />) :
                          (
                              <Button onClick={handleOpenChildComment} className={'underline p-0 ml-[3.7rem] absolute bottom-[-9px] text-gray-500 text-sm hover:text-accent-blue'}>Xem tất cả {countCommentChild?.data} phản hồi </Button>
                          ) : (<div></div>)
                  }
                  {
                      showCommentChild &&
                      <Input comment childComments fullName={fullName} idComment={id} postID={postId} />
                  }
              </div>
          </div>

      </motion.article>
  );
}
