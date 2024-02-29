import { UserLayout, ProtectedLayout } from '../../_components/layout/common-layout';
import { MainLayout } from '../../_components/layout/main-layout';
import { UserDataLayout } from '../../_components/layout/user-data-layout';
import { UserFollowLayout } from '../../_components/layout/user-follow-layout';
import { UserFollow } from '../../_components/user/user-follow';
import type { ReactElement, ReactNode } from 'react';

export default function UserFollowing(): JSX.Element {
  return (
      <ProtectedLayout>
          <MainLayout>
              <UserLayout>
                  <UserDataLayout>
                      <UserFollowLayout><UserFollow type='following' /></UserFollowLayout>
                  </UserDataLayout>
              </UserLayout>
          </MainLayout>
      </ProtectedLayout>
  );
}

