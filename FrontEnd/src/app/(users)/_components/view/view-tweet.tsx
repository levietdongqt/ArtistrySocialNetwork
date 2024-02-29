import Link from 'next/link';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { TweetReplyModal } from '../modal/tweet-reply-modal';
import { ImagePreview } from '../input/image-preview';
import { UserAvatar } from '../user/user-avatar';
import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';
import { UserUsername } from '../user/user-username';
import { variants } from '../tweet/tweet';
import { TweetActions } from '../tweet/tweet-actions';
import { TweetStats } from '../tweet/tweet-stats';
import { TweetDate } from '../tweet/tweet-date';
import { Input } from '../input/input';
import type { RefObject } from 'react';
import boolean from "async-validator/dist-types/validator/boolean";
import {Timestamp} from "firebase/firestore";

type ViewTweetProps =  {
  parentTweet?: boolean;
  pinned?: boolean;
  modal?: boolean;
  viewTweetRef?: RefObject<HTMLElement>;
};

export function ViewTweet(tweet: ViewTweetProps): JSX.Element {
  const {
    viewTweetRef,
    parentTweet,
    modal,
    pinned
  } = tweet;

  const { open, openModal, closeModal } = useModal();

  const tweetLink = `/tweet/${'tweetId'}`;

  /*const userId = user?.id as string;*/

 /* const isOwner = userId === createdBy;*/

  const reply = !!parent;

  /*const { id: parentId, username: parentUsername = username } = parent ?? {};*/
  const text = "haha";
  const images = [{
    id: '1',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'haha'
  },{
    id: '2',
    src: 'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg',
    alt: 'haha'
  }];
  return (
    <motion.article
      className={cn(
        `accent-tab h- relative flex cursor-default flex-col gap-3 border-b
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
        reply && 'scroll-m-[3.25rem] pt-0'
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
        <TweetReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>
      <div className='flex flex-col gap-2'>
        {reply && (
          <div className='flex w-12 items-center justify-center'>
            <i className='hover-animation h-2 w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          </div>
        )}
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserTooltip avatar >
            <UserAvatar src={'https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg'} alt={'name'} username={'username'} />
          </UserTooltip>
          <div className='flex min-w-0 justify-between'>
            <div className='flex flex-col truncate xs:overflow-visible xs:whitespace-normal'>
              {/*<UserTooltip {...tweetUserData}>*/}
              <UserTooltip >
                <UserName
                  className='-mb-1'
                  name={'name'}
                  username={'username'}
                  verified={false}
                />
              </UserTooltip>
              {/*<UserTooltip {...tweetUserData}>*/}
              <UserTooltip>
                <UserUsername username={'username'} />
              </UserTooltip>
            </div>
            <div className='px-4'>
              <TweetActions
                viewTweet
                isOwner={false}
                ownerId={"ownerId"}
                tweetId={"tweetId"}
                parentId={"parentId"}
                username={"username"}
                /*hasImages={!!images}*/
                hasImages={false}
                createdBy={'sssssss'}
              />
            </div>
          </div>
        </div>
      </div>
      {reply && (
        <p className='text-light-secondary dark:text-dark-secondary'>
          Replying to{' '}
          <Link href={`/user/${'parentUsername'}` } className='custom-underline text-main-accent'>
              @{'parentUsername'}
          </Link>
        </p>
      )}
      <div>
        {text && (
          <p className='whitespace-pre-line break-words text-2xl'>{text}</p>
        )}
        {images && (
          <ImagePreview
            viewTweet
            imagesPreview={images}
            previewCount={images.length}
          />
        )}
        <div
          className='inner:hover-animation inner:border-b inner:border-light-border
                     dark:inner:border-dark-border'
        >
          <TweetDate viewTweet tweetLink={tweetLink} createdAt={Timestamp.now()} />
          <TweetStats
            viewTweet
            reply={reply}
            userId={"userId"}
            isOwner={false}
            tweetId={"tweetId"}
            userLikes={["1", "2"]}
            userRetweets={["1", "2"]}
            userReplies={2}
            openModal={openModal}
          />
        </div>
        <Input reply parent={{ id: '1', username: 'username' }} />
      </div>
    </motion.article>
  );
}
