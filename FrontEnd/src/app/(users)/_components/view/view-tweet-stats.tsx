import { useState } from 'react';
import cn from 'clsx';
import { useArrayDocument } from '@lib/hooks/useArrayDocument';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { TweetStatsModal } from '../modal/tweet-stats-modal';
import { NumberStats } from '../content/number-stats';
import { UserCards } from '../user/user-cards';
import type { Tweet } from '../../../../models/tweet';

type viewTweetStats = Pick<Tweet, 'userRetweets' | 'userLikes'> & {
  likeMove: number;
  tweetMove: number;
  replyMove: number;
  currentLikes: number;
  currentTweets: number;
  currentReplies: number;
  isStatsVisible: boolean;
};

export type StatsType = 'retweets' | 'likes';

type Stats = [string, StatsType | null, number, number];

export function ViewTweetStats({
  likeMove,
  userLikes,
  tweetMove,
  replyMove,
  userRetweets,
  currentLikes,
  currentTweets,
  currentReplies,
  isStatsVisible
}: viewTweetStats): JSX.Element {
  const [statsType, setStatsType] = useState<StatsType | null>(null);

  const { open, openModal, closeModal } = useModal();
  const loading = false;
 /* const { data, loading } = useArrayDocument(
    statsType ? (statsType === 'likes' ? userLikes : userRetweets) : [],
    usersCollection,
    { disabled: !statsType }
  );*/

  const handleOpen = (type: StatsType) => (): void => {
    setStatsType(type);
    openModal();
  };

  const handleClose = (): void => {
    setStatsType(null);
    closeModal();
  };

  const allStats: Readonly<Stats[]> = [
    ['Reply', null, replyMove, currentReplies],
    ['Retweet', 'retweets', tweetMove, currentTweets],
    ['Like', 'likes', likeMove, currentLikes]
  ];

  return (
    <>
      <Modal
        modalClassName='relative bg-main-background rounded-2xl max-w-xl w-full 
                        h-[672px] overflow-hidden rounded-2xl'
        open={open}
        closeModal={handleClose}
      >
        <TweetStatsModal statsType={statsType} handleClose={handleClose}>
          <UserCards
            follow
            type={statsType as StatsType}
            data={[]}
            loading={loading}
          />
        </TweetStatsModal>
      </Modal>
      {isStatsVisible && (
        <div
          className='flex gap-4 px-1 py-4 text-light-secondary dark:text-dark-secondary
                     [&>button>div]:font-bold [&>button>div]:text-light-primary 
                     dark:[&>button>div]:text-dark-primary'
        >
          {allStats.map(
            ([title, type, move, stats], index) =>
              !!stats && (
                <button
                  className={cn(
                    `hover-animation mt-0.5 mb-[3px] flex h-4 items-center gap-1 border-b 
                     border-b-transparent outline-none hover:border-b-light-primary 
                     focus-visible:border-b-light-primary dark:hover:border-b-dark-primary
                     dark:focus-visible:border-b-dark-primary`,
                    index === 0 && 'cursor-not-allowed'
                  )}
                  key={title}
                  onClick={type ? handleOpen(type) : undefined}
                >
                  <NumberStats move={move} stats={stats} />
                  <p>{`${
                    stats === 1
                      ? title
                      : stats > 1 && index === 0
                      ? `${title.slice(0, -1)}ies`
                      : `${title}s`
                  }`}</p>
                </button>
              )
          )}
        </div>
      )}
    </>
  );
}
