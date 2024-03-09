
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { delayScroll } from '@lib/utils';
import { Modal } from '../modal/modal';
import { TweetReplyModal } from '../modal/tweet-reply-modal';
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


export type TweetProps = /*Content &*/ {
  /*user: User;*/
  modal?: boolean;
  pinned?: boolean;
  /*profile?: User | null;*/
  parentTweet?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function Content(tweet: TweetProps) {

  /*const { id: ownerId, name, username, verified, photoURL } = tweetUserData;

  const { user } = useAuth();


  const tweetLink = `/content/${tweetId}`;

  const userId = user?.id as string;

  const isOwner = userId === createdBy;

  const { id: parentId, username: parentUsername = username } = parent ?? {};*/
  const { open, openModal, closeModal } = useModal();

  /*const {
    id: profileId,
    name: profileName,
    username: profileUsername
  } = profile ?? {};*/

  /*const reply = !!parent;
  const tweetIsRetweeted = userRetweets.includes(profileId ?? '');*/


  const modal = false;
  const parentTweet = false;
  const reply = true;
  const pinned = false;
  const tweetIsRetweeted = true;
const verified = false;
const text = "verified";
  const images = [{
    id: '1',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_color_272x92dp'
  },{
    id: '2',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'googlelogo_ssdssds'
  }];
  return (
    <motion.article
      {...(!modal ? { ...variants, layout: 'position' } : {})}
      animate={{
        ...variants.animate,
        /*...(parentTweet && { transition: { duration: 0.2 } })*/
      }}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>
      <Link href={"tweetLink"} scroll={!reply} className={cn(
          `accent-tab hover-card relative flex flex-col 
             gap-y-4 px-4 py-3 outline-none duration-200`,
          parentTweet
              ? 'mt-0.5 pt-2.5 pb-0'
              : 'border-b border-light-border dark:border-dark-border'
      )}
            onClick={delayScroll(200)}
      >
          <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
            <AnimatePresence initial={false}>
              {modal ? null : pinned ? (
                <ContentStatus type='pin'>
                  <p className='text-sm font-bold'>Pinned Tweet</p>
                </ContentStatus>
              ) : (
                tweetIsRetweeted && (
                  <ContentStatus type='tweet'>
                    {/*<Link href={profileUsername as string} className='custom-underline truncate text-sm font-bold'>*/}
                    <Link href={"haha"} className='custom-underline truncate text-sm font-bold'>
                       {/* {userId === profileId ? 'You' : profileName} Retweeted*/}
                      You
                    </Link>
                  </ContentStatus>
                )
              )}
            </AnimatePresence>
            <div className='flex flex-col items-center gap-2'>
              {/*<UserTooltip avatar modal={modal} {...tweetUserData}>*/}
              <UserTooltip avatar modal={modal}>
                <UserAvatar src={"https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"} alt={"name"} username={"username"} />
              </UserTooltip>
              {parentTweet && (
                <i className='hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
              )}
            </div>
            <div className='flex min-w-0 flex-col'>
              <div className='flex justify-between gap-2 text-light-secondary dark:text-dark-secondary'>
                <div className='flex gap-1 truncate xs:overflow-visible xs:whitespace-normal'>
                 {/* <UserTooltip modal={modal} {...tweetUserData}>*/}
                  <UserTooltip modal={modal}>
                    <UserName
                      name={"name"}
                      username={"username"}
                      verified={verified}
                      className='text-light-primary dark:text-dark-primary'
                    />
                  </UserTooltip>
                  {/*<UserTooltip modal={modal} {...tweetUserData}>*/}
                  <UserTooltip modal={modal}>
                    <UserUsername username={"username"} />
                  </UserTooltip>
                  <ContentDate tweetLink={"tweetLink"} createdAt={Timestamp.now()} />
                </div>
                <div className='px-4'>
                  {!modal && (
                    <ContentAction
                      isOwner={false}
                      ownerId={"ownerId"}
                      tweetId={"tweetId"}
                      parentId={"parentId"}
                      username={"username"}
                      /*hasImages={!!images}*/
                      hasImages={false}
                      createdBy={"Time"}
                    />
                  )}
                </div>
              </div>
              {(reply || modal) && (
                <p
                  className={cn(
                    'text-light-secondary dark:text-dark-secondary',
                    modal && 'order-1 my-2'
                  )}
                >
                  Replying to{' '}
                  <Link href={`/user/${"parentUsername"}`} className='custom-underline text-main-accent'>
                      @{"parentUsername"}
                  </Link>
                </p>
              )}
              {text && (
                <p className='whitespace-pre-line break-words'>{text}</p>
              )}
              <div className='mt-1 flex flex-col gap-2'>
                {images && (
                  <ImagePreview
                    tweet
                    imagesPreview={images}
                    previewCount={images.length}
                  />
                )}
                {!modal && (
                  <ContentStats
                    reply={reply}
                    userId={"userId"}
                    /*isOwner={isOwner}*/
                    isOwner={false}
                    tweetId={"tweetId"}
                    /*userLikes={userLikes}*/
                    userLikes={["s","ss","sss"]}
                    /*userReplies={userReplies}*/
                    userReplies={2}
                    /*userRetweets={userRetweets}*/
                    userRetweets={["s","ss","sss"]}
                    /*openModal={!parent ? openModal : undefined}*/
                    openModal={openModal}
                  />
                )}
              </div>
            </div>
          </div>
      </Link>
    </motion.article>
  );
}
