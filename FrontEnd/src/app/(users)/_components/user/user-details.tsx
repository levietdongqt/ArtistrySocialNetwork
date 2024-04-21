import { formatDate } from '@lib/date';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { UserName } from './user-name';
import { UserFollowing } from './user-following';
import { UserFollowStats } from './user-follow-stats';
import type { IconName } from '@components/ui/hero-icon';
import {User} from "@models/user";
import {Timestamp} from "firebase/firestore";


type UserDetailsProps = Pick<
  User,
  | 'id'
  | 'bio'
  | 'fullName'
  | 'location'
  | 'verified'
  | 'avatar'
  | 'coverImage'
  | 'createDate'
>& {
  follow?: boolean;
  following?: boolean;
};

type DetailIcon = [string | null, IconName];

export function UserDetails({
  id,
  bio,
  fullName,
  location,
  verified,
    avatar,
    coverImage,
    createDate
}: UserDetailsProps): JSX.Element {

  const createDateTimestamp = Timestamp.fromDate(new Date(createDate));
  console.log(
      "test",createDate,'id', fullName
  )
  const detailIcons: Readonly<DetailIcon[]> = [
    // [ location, 'MapPinIcon'],
    // [website, 'LinkIcon'],
    [`Joined ${formatDate(createDateTimestamp, 'joined')}`, 'CalendarDaysIcon']
  ];

  return (
    <>
      <div>
        <UserName
          className='-mb-1 text-xl'
          name={fullName}
          iconClassName='w-6 h-6'
          verified={verified}
        />
        <div className='flex items-center gap-1 text-light-secondary dark:text-dark-secondary'>
          <p>@{fullName}</p>
          <UserFollowing userTargetId={id} />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {bio && <p className='whitespace-pre-line break-words'>{bio}</p>}
        <div className='flex flex-wrap gap-x-3 gap-y-1 text-light-secondary dark:text-dark-secondary'>
          {detailIcons.map(
            ([detail, icon], index) =>
              detail && (
                <div className='flex items-center gap-1' key={icon}>
                  <i>
                    <HeroIcon className='h-5 w-5' iconName={icon} />
                  </i>
                  {index === 1 ? (
                    <a
                      className='custom-underline text-main-accent'
                      href={`https://${detail}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {detail}
                    </a>
                  ) : index === 2 ? (
                    <button className='custom-underline group relative'>
                      {detail}
                      <ToolTip
                        className='translate-y-1'
                        tip={formatDate(createDateTimestamp, 'full')}
                      />
                    </button>
                  ) : (
                    <p>{detail}</p>
                  )}
                </div>
              )
          )}
        </div>
      </div>
      {/*<UserFollowStats following={following} followers={followers} />*/}
    </>
  );
}
