'use client'
import React, {useMemo} from 'react';
import {Button} from "@components/ui/button";
import {HeroIcon} from "@components/ui/hero-icon";
import {ToolTip} from "@components/ui/tooltip";
import {Loading} from "@components/ui/loading";
import {AnimatePresence} from "framer-motion";
import {useModal} from "@lib/hooks/useModal";
import {ActionModal} from "../modal/action-modal";
import {MainHeader} from "../home/main-header";
import {StatsEmpty} from "../content/stats-empty";
import {useUser} from "../../../../context/user-context";
import {Modal} from "../modal/modal";
import useSWR from "swr";
import {getBookmarksByUserId} from "../../../../services/realtime/clientRequest/bookmarksClient";
import {fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {getPostById, getPostListByPostId} from "../../../../services/realtime/clientRequest/postClient";
import {ContentPost} from "../content/content";
import {toast} from "react-toastify";
import {deleteAllBokMarksByUserId} from "../../../../services/realtime/ServerAction/bookmarksService";
import {SEO} from "../common/seo";

const ContainerBookmarks = () => {
    const { currentUser } = useUser();

    const { open, openModal, closeModal } = useModal();

    const userId = useMemo(() => currentUser?.id as string, [currentUser]);
    const { data: bookmarksRef, isLoading: bookmarksRefLoading } = useSWR(getBookmarksByUserId(userId),fetcherWithToken,{
        revalidateIfStale: false,
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const postId = useMemo(
        () => bookmarksRef?.data?.map((item: any) => item.postId) ?? [],
        [bookmarksRef]
    );

    const { data: postData, isLoading: postLoading } = useSWR(getPostListByPostId(postId),fetcherWithToken);


    const handleClear = async (): Promise<void> => {
        await deleteAllBokMarksByUserId(userId);
        closeModal();
        toast.success('Xóa tất cả bookmarks thành công');
    };
    return (
        <>
            <SEO title='Page / Bookmarks' />
            <Modal
                modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
                open={open}
                closeModal={closeModal}
            >
                <ActionModal
                    actionReport={()=>{}}
                    title='Clear all Page?'
                    description='This can’t be undone and you’ll remove all Tweets you’ve added to your Page.'
                    mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
                    mainBtnLabel='Clear'
                    action={handleClear}
                    closeModal={closeModal}
                />
            </Modal>
            <MainHeader className='flex items-center justify-between'>
                <div className='-mb-1 flex flex-col'>
                    <h2 className='-mt-1 text-xl font-bold'>Đã Lưu</h2>
                    <p className='text-xs text-light-secondary dark:text-dark-secondary'>
                        {currentUser?.fullName}
                    </p>
                </div>
                <Button
                    className='dark-bg-tab group relative p-2 hover:bg-light-primary/10
                     active:bg-light-primary/20 dark:hover:bg-dark-primary/10
                     dark:active:bg-dark-primary/20'
                    onClick={openModal}
                >
                    <HeroIcon className='h-5 w-5' iconName='ArchiveBoxXMarkIcon' />
                    <ToolTip
                        className='!-translate-x-20 translate-y-3 md:-translate-x-1/2'
                        tip='Clear bookmarks'
                    />
                </Button>
            </MainHeader>
            <section className='mt-0.5'>
                {bookmarksRefLoading || postLoading ? (
                    <Loading className='mt-5' />
                ) : !bookmarksRef ? (
                    <StatsEmpty
                        title='Save Tweets for later'
                        description='Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.'
                        imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
                    />
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {postData?.data?.map((post:any) => (
                            <ContentPost {...post} key={post.id} />
                        ))}
                    </AnimatePresence>
                )}
            </section>
        </>
    );
};

export default ContainerBookmarks;