import Link from 'next/link';

import { FollowButton } from '@components/ui/follow-button';
import { UserTooltip } from './user-tooltip';
import { UserName } from './user-name';
import { UserFollowing } from './user-following';
import { UserUsername } from './user-username';
import {UserAvatar} from "./user-avatar";
import {User} from "@models/user";


type UserCardProps = User &  {

  modal?: boolean;
  follow?: boolean;
  friends?: boolean;
};

export function UserCard(user: UserCardProps): JSX.Element {
  const {id, bio, modal, follow, fullName, verified, avatar,friends } = user;

  return (
    <Link href={`/user/${"username"}`}  className='accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'>
        <UserTooltip avatarCheck modal={modal} {...user}>
          <UserAvatar src={avatar} alt={fullName} username={fullName} friend />
        </UserTooltip>
        <div className='flex flex-col gap-1 truncate xs:overflow-visible'>
          <div className='flex items-center justify-between gap-2 truncate xs:overflow-visible'>
            <div className='flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal'>
              <UserTooltip {...user} modal={modal}>
                <UserName
                  className='-mb-1'
                  name={fullName}
                  username={fullName}
                  verified={verified}
                />
              </UserTooltip>
              <div className='flex items-center gap-1 text-light-secondary dark:text-dark-secondary'>
                <UserTooltip modal={modal} {...user}>
                  <UserUsername username={fullName} />
                </UserTooltip>
                {follow && <UserFollowing userTargetId={id}  hovered/>}
              </div>
            </div>
            <FollowButton userTargetId={id} userTargetUsername={fullName}  hovered/>
          </div>
          {follow && bio && !friends && <p className='whitespace-normal'>{bio}</p>}
        </div>
    </Link>
  );
}
