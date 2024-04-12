'use client'
import {useMemo, useState} from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/oauth2-context';
import { useModal } from '@lib/hooks/useModal';
import { delayScroll, preventBubbling, sleep } from '@lib/utils';
import { Modal } from '../modal/modal';
import { ActionModal } from '../modal/action-modal';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import { CustomIcon } from '@components/ui/custom-icon';
import type { Variants } from 'framer-motion';
import type { Post } from '../../../../models/post';
import type { User } from '../../../../models/user';
import {useUser} from "../../../../context/user-context";
import useSWR from "swr";
import {deletePosts, deletePosts1} from "../../../../services/realtime/clientRequest/postClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";

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
  parentId?: string;
  hasImages: boolean;
  viewTweet?: boolean;
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
  parentId,
  username,
  hasImages,
  viewTweet,
  createdBy
}: TweetActionsProps): JSX.Element {
  const { currentUser } = useUser();
  const { push } = useRouter();
  const userId = currentUser?.id as string;

  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal
  } = useModal();

  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal
  } = useModal();
  // const isInAdminControl = isAdmin && !isOwner;
  // const postIsPinned = pinnedTweet === postId;
 const handleRemove = async (): Promise<void> => {
    if (viewTweet)
      if (parentId) {
        // const parentSnapshot = await getDoc(doc(tweetsCollection, parentId));
        // if (parentSnapshot.exists()) {
        //   await push(`/content/${parentId}`, undefined);
        //   delayScroll(200)();
        //   await sleep(50);
        // } else await push('/home');
      } else await push('/home')
    await Promise.all([
      deletePosts1(postId)
      // manageTotalTweets('decrement', ownerId),
      // hasImages && manageTotalPhotos('decrement', createdBy),
      // parentId && manageReply('decrement', parentId)
    ]);
    toast.success(
      `bài viết bạn đã xóa`
    );
    removeCloseModal();
  };

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
const  isAdmin = true;
const  tweetIsPinned = false;
const  userIsFollowed = false;
  let currentPinModalData = {
    title: 'Pin Content to from profile?',
    description:
      'This will appear at the top of your profile and replace any previously pinned Content.',
    mainBtnLabel: 'Pin'
  };
  return (
    <>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={removeOpen}
        closeModal={removeCloseModal}
      >
        <ActionModal
          title='Xóa bài viết'
          description={`Bạn muốn xóa bài viết ngày không`}
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
          mainBtnLabel='Delete'
          focusOnMainBtn
          action={handleRemove}
          closeModal={removeCloseModal}
        />
      </Modal>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={pinOpen}
        closeModal={pinCloseModal}
      >
        <div>
          <p>Hello</p>
        </div>
        <ActionModal
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
                  className='menu-container group absolute top-[50px] right-2 whitespace-nowrap text-light-primary 
                             dark:text-dark-primary'
                  as={motion.div}
                  {...variants}
                  static
                >
                  {(isAdmin || isOwner) && (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 text-accent-red
                                 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(removeOpenModal)}
                    >
                      <HeroIcon iconName='TrashIcon' />
                      Delete
                    </Popover.Button>
                  )}
                  {isOwner ? (
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
                  ) : userIsFollowed ? (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={/*preventBubbling(
                        handleFollow(close, 'unfollow', /!*userId*!/'1', createdBy)
                      )*/()=>{}}
                    >
                      <HeroIcon iconName='UserMinusIcon' />
                      Unfollow @{username}
                    </Popover.Button>
                  ) : (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={/*preventBubbling(
                        handleFollow(close, 'follow', /!*userId*!/'1', createdBy)
                      )*/()=>{}}
                    >
                      <HeroIcon iconName='UserPlusIcon' />
                      Follow @{username}
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
