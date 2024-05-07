import Link from 'next/link';

import { UserTooltip } from '../user/user-tooltip';
import { UserName } from '../user/user-name';
import { UserFollowing } from '../user/user-following';
import { UserUsername } from '../user/user-username';
import {UserAvatar} from "../user/user-avatar";
import {User} from "@models/user";
import {FriendButton} from "./friendButton";


type UserCardProps = User &  {
    modal?: boolean;
    follow?: boolean;
};

export function FriendRequestCard(user: UserCardProps): JSX.Element {
    const {id, bio, modal, follow, fullName, verified, avatar } = user;
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
                    <FriendButton userTargetId={id} userTargetUsername={fullName}  hovered/>
                </div>
                {follow && bio && <p className='whitespace-normal'>{bio}</p>}
            </div>
        </Link>
    );
}
