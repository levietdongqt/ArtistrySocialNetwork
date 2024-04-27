
import { UserLayout } from 'app/(users)/_components/layout/common-layout';
import { UserDataLayout } from 'app/(users)/_components/layout/user-data-layout';
import { UserFollowLayout } from 'app/(users)/_components/layout/user-follow-layout';
import { UserFollow } from 'app/(users)/_components/user/user-follow';
import type { ReactElement, ReactNode } from 'react';
export default function UserFollowers(): JSX.Element {
  return (

            //   <UserLayout>
            //       <UserDataLayout>
                      <UserFollowLayout>
                          <UserFollow type='followers' />
                      </UserFollowLayout>
            //       </UserDataLayout>
            //   </UserLayout>
  );
}

