'use client'
import { useRouter } from 'next/navigation';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { toast } from 'react-toastify';
import { useModal } from '@lib/hooks/useModal';
import {  preventBubbling } from '@lib/utils';
import { Modal } from '../modal/modal';
import { ActionModal } from '../modal/action-modal';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import { CustomIcon } from '@components/ui/custom-icon';
import type { Variants } from 'framer-motion';
import type { Post } from '@models/post';
import {useUser} from "../../../../context/user-context";
import useSWR, {mutate} from "swr";
import {deletePosts1} from "../../../../services/realtime/ServerAction/PostService";
import {deleteComment} from "../../../../services/realtime/ServerAction/CommentService";
import {createReport} from "../../../../services/realtime/ServerAction/ReportService";
import {getBookmarksByUserId} from "../../../../services/realtime/clientRequest/bookmarksClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {
    bookmarksPost,
    deleteBokMarksByUserIdAndPostId
} from "../../../../services/realtime/ServerAction/bookmarksService";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {mutateState} from "@lib/hooks/mutateState";
import {mutateDeleteComment} from "@lib/hooks/mutateDelete";
import {mutatePostId} from "@lib/hooks/mutatePostId";
import {mutateDeleteCommentState} from "@lib/hooks/mutateDeleteState";
import {mutateBookmarkByPostId} from "@lib/hooks/mutateBookmarkByPostId";
import {mutateBookmark} from "@lib/hooks/mutateBookmark";
import {mutateProfilePost} from "@lib/hooks/mutateProfilePost";

export const variants: Variants = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4 }
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } }
};

type TweetActionsProps = Pick<Post, 'createdBy'> & {
  isOwner: boolean;
  ownerId: string;
  postId: string;
  username: string;
  hasImages: boolean;
  viewTweet?: boolean;
  comment?: boolean;
  commentId?: string;
  reported?: (check:boolean) => void;
  bookmark?:boolean;
};

type PinModalData = Record<'title' | 'description' | 'mainBtnLabel', string>;

const pinModalData: Readonly<PinModalData[]> = [
  {
    title: 'Pin Content to from profile?',
    description:
      'This will appear at the top of your profile and replace any previously pinned Content.',
    mainBtnLabel: 'Pin'
  },
  {
    title: 'Unpin Content from profile?',
    description:
      'This will no longer appear automatically at the top of your profile.',
    mainBtnLabel: 'Unpin'
  }
];

export function ContentAction({
  isOwner,
  ownerId,
  postId,
  username,
  hasImages,
  viewTweet,
  createdBy,comment,
                                  commentId,reported

}: TweetActionsProps): JSX.Element {
  const { currentUser } = useUser();
  const { push } = useRouter();
    const [hovered, setHovered] = useState(false);

    const userId = currentUser?.id as string;
    const [isCheckBookmark, setIsCheckBookmark] = useState(false);
  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal
  } = useModal();
    const {
    open: reportOpen,
    openModal: reportOpenModal,
    closeModal: reportCloseModal
    } = useModal();
  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal
  } = useModal();
  const mutatePost = useRecoilValue(mutateState);
  const muatateComment = useRecoilValue(mutateDeleteComment);
  const mutatePostById = useRecoilValue(mutatePostId);
  const mutateCommentState = useRecoilValue(mutateDeleteCommentState);
  const mutateBookmarkByPostIdAndUserId = useRecoilValue(mutateBookmarkByPostId);
  const mutateBookmarks = useRecoilValue(mutateBookmark);
    const mutatePostProfile = useRecoilValue(mutateProfilePost);
    useEffect(() => {
        if(hovered){
            setHovered((prev:boolean) => !prev);
        }
    }, [hovered]);
  // const isInAdminControl = isAdmin && !isOwner;
  // const postIsPinned = pinnedTweet === postId;
 const handleRemove = async (): Promise<void> => {
    if(currentUser !== null) {
        if (!comment) {
            if (mutatePost) {
                await deletePosts1(postId);
                if( mutatePost){
                    await mutatePost()
                }
                if (mutatePostProfile) {
                    await mutatePostProfile();
                }
                toast.success(
                    `bài viết bạn đã xóa`
                );
            }
            removeCloseModal();
        } else {
            await deleteComment(commentId as string);
            if (muatateComment) {
                await muatateComment()
            }
            if (mutatePostById) {
                await mutatePostById()
            }
            if (mutateCommentState) {
                await mutateCommentState()
            }
            toast.success(
                `bài viết bạn đã bình luận này`
            );
        }
            removeCloseModal();
    }
  };
    const {data: userBookmarks, isLoading} = useSWR(hovered ? getBookmarksByUserId(userId) : null, fetcherWithToken);
    const handleBookmark =
        (closeMenu: () => void, args:string, useid:string,postid:string) =>
            async (): Promise<void> => {
                const type = args;
                const data = {
                    postId:  postid,
                    userId: useid
                }
                    setIsCheckBookmark(prevState => !prevState);
                    await bookmarksPost(data);
                    if(mutatePost ){
                        await mutatePost();
                    }
                    if(mutatePostProfile){
                        await mutatePostProfile();
                    }
                    if(mutateBookmarks){
                        await mutateBookmarks();
                    }
                closeMenu();
                toast.success(
                    type === 'bookmark'
                        ? (): JSX.Element => (
                            <span className='flex gap-2'>
                Bài viết bạn đã lưu
                <Link href='/bookmarks'>
                  <p className='custom-underline font-bold'>View</p>
                </Link>
              </span>
                        )
                        : 'Bài post đã xóa khỏi danh sách lưu'
                );
            };

 const handleReport = async (value:string, content:string) : Promise<void> =>{
    if(currentUser !== null){
        const reportData = {
            userId:currentUser?.id,
            title: value,
            postId: postId,
            content: content
        }
        await Promise.all([
            createReport(reportData)
        ]);
        if (reported) {
            reported(true);
        }
        toast.success(
            `bài viết đã được report`
        );
        reportCloseModal();
    }
 }
  // const handleFollow =
  //   (closeMenu: () => void, ...args: Parameters<typeof manageFollow>) =>
  //   async (): Promise<void> => {
  //     const [type] = args;
  //
  //     closeMenu();
  //     /*await manageFollow(...args);*/
  //
  //     toast.success(
  //       `You ${type === 'follow' ? 'followed' : 'unfollowed'} @${username}`
  //     );
  //   };

  // const userIsFollowed = following.includes(createdBy);
  // const currentPinModalData = useMemo(
  //   () => pinModalData[+tweetIsPinned],
  //
  //   [pinOpen]
  // );
const  isInAdminControl = false;
const  tweetIsPinned = false;
const  userIsFollowed = false;
    useEffect(() => {
        const tweetIsBookmarked = !!userBookmarks?.data?.some((items:any) => items.postId === postId);
        if(tweetIsBookmarked)
            setIsCheckBookmark(true);
    }, [isCheckBookmark,userBookmarks?.data]);
  let currentPinModalData = {
    title: 'Pin Content to from profile?',
    description:
      'This will appear at the top of your profile and replace any previously pinned Content.',
    mainBtnLabel: 'Pin'
  };
  return (
    <>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl '
        open={removeOpen}
        closeModal={removeCloseModal}
      >
        <ActionModal
            actionReport={()=>{}}
          title={comment ? 'Xóa bình luận' : 'Xóa bài viết'}
          description={`Bạn muốn xóa ${comment ? 'bình luận' : 'bài viết'} này không`}
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
          mainBtnLabel='Delete'
          focusOnMainBtn
          action={handleRemove}
          closeModal={removeCloseModal}
        />
      </Modal>
        <Modal
            modalClassName='max-w-xl bg-main-background w-full p-8 rounded-2xl '
            open={reportOpen}
            closeModal={reportCloseModal}
        >
            <ActionModal
                action={()=>{}}
                report
                title={'Báo cáo'}
                description={`Hãy cho Admin biết bài viết này có vấn đề gì. Chúng tôi sẽ không thông báo cho người đăng rằng bạn đã báo cáo bài viết.`}
                mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
                mainBtnLabel='Gửi'
                focusOnMainBtn
                actionReport={handleReport}
                closeModal={reportCloseModal}
            />
        </Modal>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={pinOpen}
        closeModal={pinCloseModal}
      >
        <ActionModal
            actionReport={()=>{}}
          {...currentPinModalData}
          mainBtnClassName='bg-light-primary hover:bg-light-primary/90 active:bg-light-primary/80 dark:text-light-primary
                            dark:bg-light-border dark:hover:bg-light-border/90 dark:active:bg-light-border/75'
          focusOnMainBtn
          action={/*handlePin*/() =>{}}
          closeModal={pinCloseModal}
        />
      </Modal>
      <Popover>
        {({ open, close }): JSX.Element => (
          <>
            <Popover.Button
              as={Button}
              className={cn(
                `main-tab group group absolute top-2 right-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
                open && 'bg-accent-blue/10 [&>div>svg]:text-accent-blue'
              )}
              onMouseOver={() => {
                  setHovered((prev:boolean) => !prev)}
            }
            >
              <div className='group relative'>
                <HeroIcon
                  className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                             group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
                  iconName='EllipsisHorizontalIcon'
                />
                {!open && <ToolTip tip='More' />}
              </div>
            </Popover.Button>
            <AnimatePresence>
              {open && (
                <Popover.Panel
                  className={cn(`menu-container group absolute top-[50px] right-2 whitespace-nowrap text-light-primary 
                             dark:text-dark-primary`,{
                  'top-[-5.625rem] right-[2.7rem]': comment,
                  })}
                  as={motion.div}
                  {...variants}
                  static
                >
                  {(isOwner) && (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 text-accent-red
                                 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(removeOpenModal)}
                    >
                      <HeroIcon iconName='TrashIcon' />
                      Xóa
                    </Popover.Button>
                  )}
                  {isOwner && !comment ? (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(pinOpenModal)}
                    >
                      {tweetIsPinned ? (
                        <>
                          <CustomIcon iconName='PinOffIcon' />
                          Unpin from profile
                        </>
                      ) : (
                        <>
                          <CustomIcon iconName='PinIcon' />
                          Pin to your profile
                        </>
                      )}
                    </Popover.Button>
                  ) : <></>}
                    {
                        !isOwner && (
                            <Popover.Button
                                className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                                as={Button}
                                onClick={preventBubbling(reportOpenModal)}
                            >
                                <HeroIcon iconName={'ExclamationTriangleIcon'}/>
                                Báo cáo bài viết
                            </Popover.Button>
                        ) }
                    {
                        !isOwner && (
                            <Popover.Button
                                className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                                as={Button}
                                onClick={() => {}}
                            >
                                <HeroIcon iconName={'NoSymbolIcon'}/>
                                Chặn người dùng
                            </Popover.Button>
                        )
                    }
                    { !isOwner &&(
                            <Popover.Button
                                className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                                as={Button}
                                onClick={() => {}}
                            >
                                <HeroIcon iconName={'ArrowTrendingDownIcon'}/>
                                Giảm tương tác
                            </Popover.Button>
                        )
                    }
                    {!isCheckBookmark ? (
                        <Popover.Button
                            className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                            as={Button}
                            onClick={preventBubbling(
                                handleBookmark(close, 'bookmark', userId, postId)
                            )}
                        >
                            <HeroIcon iconName='BookmarkIcon' />
                            Lưu bài post
                        </Popover.Button>
                    ) : (
                        <Popover.Button
                            className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                            as={Button}
                            onClick={preventBubbling(
                                handleBookmark(close, 'unbookmark', userId, postId)
                            )}
                        >
                            <HeroIcon iconName='BookmarkSlashIcon' />
                            Xóa bài post đã lưu
                        </Popover.Button>
                    )}
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </>
  );
}
