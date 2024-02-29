import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../context/auth-context';
import { useUser } from '../../../../context/user-context';
import { SEO } from '../common/seo';
import { UserHomeCover } from '../user/user-home-cover';
import { UserHomeAvatar } from '../user/user-home-avatar';
import { UserDetails } from '../user/user-details';
import { UserNav } from '../user/user-nav';
import { Button } from '@components/ui/button';
import { Loading } from '@components/ui/loading';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { FollowButton } from '@components/ui/follow-button';
import { variants } from '../user/user-header';
import { UserEditProfile } from '../user/user-edit-profile';
import { UserShare } from '../user/user-share';
import type { LayoutProps } from './common-layout';

export function UserHomeLayout({ children }: LayoutProps): JSX.Element {
  /*const { user, isAdmin } = useAuth();*/
  const { user: userData, loading } = useUser();

  const {
    query: { id }
  } = useRouter();

  const coverData = userData?.coverPhotoURL
    ? { src: userData.coverPhotoURL, alt: userData.name }
    : null;

  const profileData = userData
    ? { src: userData.photoURL, alt: userData.name }
    : null;

 /* const { id: userId } = user ?? {};*/

  /*const isOwner = userData?.id === userId;*/
  const isOwner = true;
  const isAdmin = false;

  return (
    <>
      {userData && (
        <SEO
          title={`${`${userData.name} (@${userData.username})`} / Social`}
        />
      )}
      <motion.section {...variants} exit={undefined}>
        {loading ? (
          <Loading className='mt-5' />
        ) : !userData ? (
          <>
            <UserHomeCover />
            <div className='flex flex-col gap-8'>
              <div className='relative flex flex-col gap-3 px-4 py-3'>
                <UserHomeAvatar />
                <p className='text-xl font-bold'>@{id}</p>
              </div>
              <div className='p-8 text-center'>
                <p className='text-3xl font-bold'>This account doesn’t exist</p>
                <p className='text-light-secondary dark:text-dark-secondary'>
                  Try searching for another.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <UserHomeCover coverData={coverData} />
            <div className='relative flex flex-col gap-3 px-4 py-3'>
              <div className='flex justify-between'>
                <UserHomeAvatar profileData={profileData} />
                {isOwner ? (
                  <UserEditProfile />
                ) : (
                  <div className='flex gap-2 self-start'>
                    <UserShare username={userData.username} />
                    <Button
                      className='dark-bg-tab group relative cursor-not-allowed border border-light-line-reply p-2
                                 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                    >
                      <HeroIcon className='h-5 w-5' iconName='EnvelopeIcon' />
                      <ToolTip tip='Message' />
                    </Button>
                    <FollowButton
                      userTargetId={userData.id}
                      userTargetUsername={userData.username}
                    />
                    {isAdmin && <UserEditProfile hide />}
                  </div>
                )}
              </div>
              <UserDetails {...userData} />
            </div>
          </>
        )}
      </motion.section>
      {userData && (
        <>
          <UserNav />
          {children}
        </>
      )}
    </>
  );
}
