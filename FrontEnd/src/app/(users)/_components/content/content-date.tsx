import Link from 'next/link';
import cn from 'clsx';
import { formatDate } from '@lib/date';
import { ToolTip } from '@components/ui/tooltip';
import {Timestamp} from "firebase/firestore";

type TweetDateProps =  {
  tweetLink: string;
  viewTweet?: boolean;
  createdAt: Timestamp;
};

export function ContentDate({
  createdAt,
  tweetLink,
  viewTweet
}: TweetDateProps): JSX.Element {
  return (
    <div className={cn('flex gap-1', viewTweet && 'py-4')}>
      {!viewTweet && <i>·</i>}
      <div className='group relative'>
        <Link href={tweetLink} className={cn(
            'custom-underline peer whitespace-nowrap',
            viewTweet && 'text-light-secondary dark:text-dark-secondary'
        )}>
            {/*{formatDate(createdAt, viewTweet ? 'full' : 'tweet')}*/}
          {createdAt.toString()}
        </Link>
        <ToolTip
          className='translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible
                     peer-focus-visible:delay-200'
          // tip={formatDate(createdAt, 'full')}
            tip={createdAt.toString()}
        />
      </div>
    </div>
  );
}
