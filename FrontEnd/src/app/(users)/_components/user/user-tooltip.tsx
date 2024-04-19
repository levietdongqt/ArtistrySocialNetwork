'use client'
import Link from 'next/link';
import cn from 'clsx';
import { useWindow } from '../../../../context/window-context';
import { FollowButton } from '@components/ui/follow-button';
import { NextImage } from '@components/ui/next-image';
import { UserAvatar } from './user-avatar';
import { UserName } from './user-name';
import { UserFollowing } from './user-following';
import { UserUsername } from './user-username';
import type { ReactNode } from 'react';
import {User} from "@models/user";
import {useEffect} from "react";


type UserTooltipProps = Pick<
    User,
    | 'id'
    | 'bio'
    | 'fullName'
    | 'verified'
    | 'avatar'
    | 'coverImage'
> & {
  modal?: boolean;
  avatarCheck?: boolean;
  children: ReactNode;
};

type Stats = [string, string, number];

export function UserTooltip({
                              id,
                              bio,
                              fullName,
                              modal,
                              avatar,
                              verified,
                              children,
                              coverImage,
  avatarCheck,
}: UserTooltipProps):JSX.Element {
  const { isMobile } = useWindow();
  'use client'
  if (isMobile || modal) return <>{children}</>;
  const userLink = `/profile/${id}`;

  const allStats: Readonly<Stats[]> = [
    ['following', 'Following',2],
    ['followers', 'Followers',2]
  ];


  return (
    <div
      className={cn(
        'group relative self-start text-light-primary dark:text-dark-primary',
        avatarCheck ? '[&>div]:translate-y-2' : 'grid [&>div]:translate-y-7'
      )}
    >
      {children}
      <div
        className='menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl 
                   opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible 
                   group-hover:opacity-100 group-hover:delay-500'
      >
        <div className='flex flex-col gap-3 p-4'>
          <div className='flex flex-col gap-2'>
            <div className='-mx-4 -mt-4'>
              {coverImage ? (
                <Link href={userLink} className='blur-picture'>
                  <div className='blur-picture'>
                    <NextImage
                      useSkeleton
                      className='relative h-24'
                      imgClassName='rounded-t-2xl'
                      src={coverImage ?? "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
                      alt={fullName}
                      layout={"fill"}
                    />
                  </div>
                </Link>
              ) : (
                <div className='h-16 rounded-t-2xl bg-light-line-reply dark:bg-dark-line-reply' />
              )}
            </div>
            <div className='flex justify-between'>
              <div className='mb-10'>
                <UserAvatar
                  className='absolute -translate-y-1/2 bg-main-background p-1 
                             hover:brightness-100 [&>figure>span]:[transition:200ms]
                             [&:hover>figure>span]:brightness-75'
                  src={avatar ?? "https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg"}
                  alt={fullName}
                  size={64}
                  username={fullName}
                />
              </div>
              <FollowButton userTargetId={id} userTargetUsername={fullName} />
            </div>
            <div>
              <UserName
                className='-mb-1 text-lg'
                name={fullName}
                username={fullName}
                verified={verified}
              />
              <div className='flex items-center gap-1 text-light-secondary dark:text-dark-secondary'>
                <UserUsername username={fullName} />
                <UserFollowing userTargetId={id} />
              </div>
            </div>
          </div>
          {bio && <p>{bio}</p>}
          <div className='text-secondary flex gap-4'>
            {allStats.map(([id, label, stat]) => (
              <Link href={`${userLink}/${id}`} key={id}  className='hover-animation flex h-4 items-center gap-1 border-b border-b-transparent
                             outline-none hover:border-b-light-primary focus-visible:border-b-light-primary
                             dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary'>
                  <p className='font-bold'>{stat}</p>
                  <p className='text-light-secondary dark:text-dark-secondary'>
                    {label}
                  </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
