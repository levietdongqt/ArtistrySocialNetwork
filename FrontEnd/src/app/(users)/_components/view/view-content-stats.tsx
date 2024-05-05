
  import cn from 'clsx';
  import {motion} from "framer-motion";
  import { NumberStats } from '../content/number-stats';
  import {useEffect, useState} from "react";
  type viewContentStats = {
    likeMove: number;
    tagMove: number;
    commentMove: number;
    currentLikes: number;
    currentTag: number;
    currentComment: number;
    isStatsVisible: boolean;
    userPostLikes?: [];
    tagUserPosts?: [];
  };

  export type StatsType = 'retweets' | 'likes';

  type Stats = [string, number, number];

  export function ViewContentStats({
    likeMove,
     userPostLikes,
    tagMove,
                                     commentMove,
    tagUserPosts,
    currentLikes,
                                     currentTag,
                                     currentComment,
    isStatsVisible
  }: viewContentStats): JSX.Element {

    const [allStats, setAllStats] = useState<Stats[]>([]);
    useEffect(() => {
      setAllStats( [
        ['Bình luận', commentMove, currentComment],
        ['Tag', tagMove, currentTag],
        ['Đã Thích', likeMove, currentLikes]
      ]);
    }, [currentLikes, currentTag, currentComment, likeMove, tagMove, commentMove]);
    return (
      <>
        {isStatsVisible && (
          <motion.div
            className='flex gap-4 px-1 py-1 mt-1 text-light-secondary dark:text-dark-secondary
                       [&>button>div]:font-bold [&>button>div]:text-light-primary
                       dark:[&>button>div]:text-dark-primary'
          >
            {allStats.map(
              ([title, move, stats], index) =>
                !!stats && (
                  <span
                    className={cn(
                      ` cursor-default hover-animation mt-0.5 mb-[3px] flex h-3 items-center gap-1 border-b 
                       border-b-transparent outline-none
                       focus-visible:border-b-light-primary 
                       dark:focus-visible:border-b-dark-primary`
                    )}
                    key={title}
                  >
                    <NumberStats move={move} stats={stats} />
                    <motion.p
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.8,
                          ease: [0, 0.71, 0.2, 1.01]
                        }}>{`${
                      stats === 1
                        ? title
                        : stats > 1 && index === 0
                        ? `${title}`
                        : `${title}`
                    }`}</motion.p>
                  </span>
                )
            )}
          </motion.div>
        )}
      </>
    );
  }
