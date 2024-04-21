'use client'
import {useParams} from 'next/navigation';
import {motion} from 'framer-motion';
import {useUser} from '../../../../context/user-context';
import {SEO} from '../common/seo';
import {UserHomeCover} from '../user/user-home-cover';
import {UserHomeAvatar} from '../user/user-home-avatar';
import {UserDetails} from '../user/user-details';
import {UserNav} from '../user/user-nav';
import {Button} from '@components/ui/button';
import {Loading} from '@components/ui/loading';
import {HeroIcon} from '@components/ui/hero-icon';
import {ToolTip} from '@components/ui/tooltip';
import {FollowButton} from '@components/ui/follow-button';
import {variants} from '../user/user-header';
import {UserEditProfile} from '../user/user-edit-profile';
import {UserShare} from '../user/user-share';
import type {LayoutProps} from './common-layout';
import {useEffect} from "react";
import useSWR from "swr";
import {getUserById} from "../../../../services/main/clientRequest/userClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {User} from "@models/user";
import {SidebarLink} from "../sidebar/sidebar-link";

export function UserHomeLayout({children}: LayoutProps): JSX.Element {
    const {currentUser} = useUser();
    const {ID} = useParams();
    const {
        isLoading: loading,
        data: response,
        error,
        isValidating: checkTrue
    } = useSWR(getUserById(ID as string), fetcherWithToken);

    const coverData = response?.data.coverImage
        ? {src: response?.data.coverImage, alt: response?.data.fullName}
        : null;

    const profileData = response?.data
        ? {src: response?.data.avatar, alt: response?.data.fullName}
        : null;
  
    /* const { id: userId } = user ?? {};*/

    const isOwner = response?.data?.id === currentUser?.id;
    console.log('show param id:', ID, ' response?.data', response?.data?.id)
    return (
        <>
            {response?.data && (
                <SEO
                    title={`${`${response?.data.fullName} (@${response?.data.fullName})`} / Social`}
                />
            )}
            <motion.section {...variants} exit={undefined}>
                {loading &&
                    <Loading className='mt-5'/>
                }
                {!response?.data ? (
                    <>
                        <UserHomeCover/>
                        <div className='flex flex-col gap-8'>
                            <div className='relative flex flex-col gap-3 px-4 py-3'>
                                <UserHomeAvatar/>
                                <p className='text-xl font-bold'>@{ID}</p>
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
                        <UserHomeCover coverData={coverData}/>
                        <div className='relative flex flex-col gap-3 px-4 py-3'>
                            <div className='flex justify-between'>
                                <UserHomeAvatar profileData={profileData}/>
                                {isOwner ? (
                                    <SidebarLink
                                        href={`/profile/edit`}
                                        username={currentUser?.fullName}
                                        linkName='Sửa thông tin'
                                        iconName='UserIcon'
                                    />
                                ) : (
                                    <div className='flex gap-2 self-start'>
                                        <UserShare username={response?.data?.fullName}/>
                                        <Button
                                            className='dark-bg-tab group relative cursor-not-allowed border border-light-line-reply p-2
                                 hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
                                        >
                                            <HeroIcon className='h-5 w-5' iconName='EnvelopeIcon'/>
                                            <ToolTip tip='Message'/>
                                        </Button>
                                        <FollowButton
                                            userTargetId={response?.data?.id}
                                            userTargetUsername={response?.data?.fullName}
                                        />
                                        {/*{isOwner && <UserEditProfile hide/>}*/}
                                    </div>
                                )}
                            </div>
                            <UserDetails {...response?.data} />
                        </div>
                    </>
                )}
            </motion.section>
            {response?.data && (
                <>
                    <UserNav/>
                    {children}
                </>
            )}
        </>
    );
}
