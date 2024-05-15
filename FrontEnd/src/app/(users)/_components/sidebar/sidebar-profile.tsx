'use client'
import {AnimatePresence, motion} from 'framer-motion';
import {Menu} from '@headlessui/react';
import cn from 'clsx';
import {useModal} from '@lib/hooks/useModal';
import {Modal} from '../modal/modal';
import {ActionModal} from '../modal/action-modal';
import {Button} from '@components/ui/button';
import {HeroIcon} from '@components/ui/hero-icon';
import {CustomIcon} from '@components/ui/custom-icon';
import {UserAvatar} from '../user/user-avatar';
import {UserName} from '../user/user-name';
import {UserUsername} from '../user/user-username';
import {variants} from './more-settings';
import {useUser} from "../../../../context/user-context";
import {useRouter} from "next/navigation";
import {useOAuth2} from "../../../../context/oauth2-context";
import {deleteCookieTokenSSR} from "@lib/helper/serverCookieHandle";
import dynamic from 'next/dynamic';



export function SidebarProfile(): JSX.Element {
    // const {  signOut } = useAuth();
    const {open, openModal, closeModal} = useModal();
    const router = useRouter()
    const {signOut} = useOAuth2()
    const {currentUser} = useUser()
    /*const { name, username, verified, photoURL } = user as User;*/
    const handleSignOut = async () => {
        // router.prefetch("/login")
        console.log("SIGN OUT")
        await deleteCookieTokenSSR();
        await signOut();
        router.push("/login");
    }
    return (
        <>
            <Modal
                modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
                open={open}
                closeModal={closeModal}
            >
                <ActionModal
                    useIcon
                    focusOnMainBtn
                    title='Log out of Social?'
                    description='You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.'
                    mainBtnLabel='Log out'
                    actionReport={()=>{}}
                    // action={signOut}
                    action={() => {
                    }}
                    closeModal={closeModal}
                />
            </Modal>
            <Menu className='relative' as='section'>
                {({open}): JSX.Element => (
                    <>
                        <Menu.Button
                            className={cn(
                                `custom-button main-tab dark-bg-tab flex w-full items-center 
                 justify-between hover:bg-light-primary/10 active:bg-light-primary/20
                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
                                open && 'bg-light-primary/10 dark:bg-dark-primary/10'
                            )}
                        >
                            <div className='flex gap-3 truncate'>
                                <UserAvatar src={currentUser?.avatar as string} alt={'username'}
                                            size={40}/>
                                <div className='hidden truncate text-start leading-5 xl:block' suppressHydrationWarning>
                                    <UserName name={currentUser?.fullName!} username={currentUser?.fullName!} className='truncate' verified={!currentUser?.verified} />
                                </div>
                            </div>
                            <HeroIcon
                                className='hidden h-6 w-6 xl:block'
                                iconName='EllipsisHorizontalIcon'
                            />
                        </Menu.Button>
                        <AnimatePresence>
                            {open && (
                                <Menu.Items
                                    className='menu-container absolute left-0 right-0 -top-36 w-60 xl:w-full'
                                    as={motion.div}
                                    {...variants}
                                    static
                                >
                                    <Menu.Item
                                        className='flex items-center justify-between gap-4 border-b
                               border-light-border px-4 py-3 dark:border-dark-border'
                                        as='div'
                                        disabled
                                    >
                                        <div className='flex items-center gap-3 truncate'>
                                            <UserAvatar src={currentUser?.avatar as string}
                                                        alt={currentUser?.fullName ? currentUser?.fullName : ""}/>
                                            <div className='truncate'>
                                                {/*<UserName name={'name'} verified={verified} />*/}
                                                <UserName name={currentUser?.fullName ? currentUser?.fullName : ""}
                                                          verified={!!currentUser?.verified}/>
                                                {/*<UserUsername username={currentUser?.fullName ? currentUser?.fullName : ""} disableLink/>*/}
                                            </div>
                                        </div>
                                        <i>
                                            <HeroIcon
                                                className='h-5 w-5 text-main-accent'
                                                iconName='CheckIcon'
                                            />
                                        </i>
                                    </Menu.Item>
                                    <Menu.Item >
                                        {({active}): JSX.Element => (
                                           <div className={"mx-auto"}>
                                               <Button
                                                   className={cn(
                                                       'flex  w-full gap-3 rounded-md rounded-t-none p-4 items-center',
                                                       active && 'bg-main-sidebar-background'
                                                   )}
                                                   onClick={handleSignOut}
                                               >
                                                   <HeroIcon iconName='ArrowRightOnRectangleIcon'/>
                                                   Đăng xuất
                                               </Button>
                                           </div>
                                        )}
                                    </Menu.Item>
                                    <i
                                        className='absolute -bottom-[10px] left-2 translate-x-1/2 rotate-180
                               [filter:drop-shadow(#cfd9de_1px_-1px_1px)] 
                               dark:[filter:drop-shadow(#333639_1px_-1px_1px)]
                               xl:left-1/2 xl:-translate-x-1/2'
                                    >
                                        <CustomIcon
                                            className='h-4 w-6 fill-main-background'
                                            iconName='TriangleIcon'
                                        />
                                    </i>
                                </Menu.Items>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Menu>
            <div></div>
        </>
    );
}
